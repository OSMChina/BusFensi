import { ComponentProps, ReactNode, useState, useCallback, cloneElement} from "react"
import { ItemCollection } from "../../../components/osm/outline/itemCollectionList"
import { FeatureItem } from "./item"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons/faChevronRight"
import { Node, Relation, Way } from "../../../type/osm/meta"
import { FilterFunc } from "../../../type/view/outline/type"
import { faX } from "@fortawesome/free-solid-svg-icons/faX"
import { faMinus } from "@fortawesome/free-solid-svg-icons/faMinus"
import { FeatureTypes } from "../../../type/osm/refobj"
import { useOSMMapStore } from "../../../store/osmmeta"
import { useShallow } from "zustand/shallow"
import { createConfirmation } from "react-confirm"
import SimpleConfirm from "../../../components/modal/SimpleConfirmHook";
import { faTrash } from "@fortawesome/free-solid-svg-icons"

interface SelectedData { type: FeatureTypes, id: number }

export function FeatureList({ node, way, relation, filter, selectedFeature, setSelectedFeature, ...props }: {
    node?: Node[]
    way?: Way[]
    relation?: Relation[]
    filter?: FilterFunc,
    selectedFeature?: SelectedData[],
    setSelectedFeature?: React.Dispatch<React.SetStateAction<SelectedData[]>>
} & Omit<ComponentProps<typeof FeatureItem>, "meta" | "type">) {
    filter = filter || (() => true);

    const handleSelection = useCallback((meta: SelectedData) => {
        const isPresent = selectedFeature?.some((item) => item.id === meta.id);
        if (isPresent) {
            // If already selected, remove it
            setSelectedFeature?.((prev) => prev.filter((item) => item.id !== meta.id));
        } else {
            // If not selected, add it
            setSelectedFeature?.((prev) => [...prev, meta]);
        }
    }, [selectedFeature]);

    const checkSelected = useCallback((id: number) => {
        return selectedFeature?.some((item) => item.id === id);
    }, [selectedFeature]);

    return <ItemCollection>
        {(node || []).filter(f => filter(f, "node")).map(n => <FeatureItem {...props} isSelected={checkSelected(Number(n["@_id"]))} handleSelection={handleSelection} key={n["@_id"]} meta={n} type="node" />)}
        {(way || []).filter(f => filter(f, "way")).map(w => <FeatureItem {...props}  isSelected={checkSelected(Number(w["@_id"]))} handleSelection={handleSelection} key={w["@_id"]} meta={w} type="way" />)}
        {(relation || []).filter(f => filter(f, "relation")).map(r => <FeatureItem {...props} isSelected={checkSelected(Number(r["@_id"]))} handleSelection={handleSelection} key={r["@_id"]} meta={r} type="relation" />)}
    </ItemCollection>
}

export function FeatureCollection({ name, defaultOpen, forceOpen, forceClose, children }: {
    children: ReactNode,
    defaultOpen?: boolean,
    forceOpen?: boolean,
    forceClose?: boolean,
    name: string
}) {

    const deleteFeature = useOSMMapStore(useShallow(state => state.deleteFeature));
    const confirmModal = createConfirmation(SimpleConfirm);
    const [selectedFeature, setSelectedFeature] = useState<SelectedData[]>([]);
    const [collapsed, setCollapsed] = useState(!defaultOpen);

    const toggleCollapse: React.MouseEventHandler = (e) => {
        e.stopPropagation(); // nonsence here currently
        if (!(forceClose || forceOpen)) setCollapsed(!collapsed);
    };
    const show = forceOpen ? true : (forceClose ? false : !collapsed)

    const deleteSelected = useCallback(async () => {
        // when delete  call the delete method and initialize the selected again 
        const res = await confirmModal({
            title: "Confirm delete feature",
            message: "Are you sure you want delete these features?\n"
        });
        if (res) {
            // deleteFeature(type, id);
            selectedFeature?.map((feat) => deleteFeature(feat.type, `${feat.id}`))
        }
    }, [selectedFeature])

    return (
        <li className="outline-list-item">
            <span className=" flex flex-row items-center justify-between">
                <span className={`flex flex-row items-center gap-4`} onClick={toggleCollapse} >
                    <FontAwesomeIcon icon={(forceOpen ? faMinus : (forceClose ? faX : (!show ? faChevronRight : faChevronDown)))} />
                    <FontAwesomeIcon icon={faBars} className="ml-1" />
                    <span className="ml-0 mr-auto">{name}</span>
                </span>
                {selectedFeature.length > 1 && <button
                    className="btn btn-xs btn-square tooltip tooltip-bottom"
                    data-tip="Delete Selected"
                    onClick={deleteSelected}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>}
            </span>
            {show && cloneElement(children as React.ReactElement, { selectedFeature, setSelectedFeature })}
        </li>
    );
}