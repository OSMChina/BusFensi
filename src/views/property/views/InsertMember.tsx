import { useShallow } from "zustand/react/shallow"
import { useEffect, useMemo, useState } from "react";
import { InsertHandeler } from "../../../type/view/property/type";
import { FeatureRefObj } from "../../../type/osm/refobj";
import { useOSMMapStore } from "../../../store/osmmeta";
import { ItemBaseDisplay } from "../../../components/osm/outline/itemBase";
import { getName, getNodeType } from "../../../utils/osm/nodeType";
import { getRelationType } from "../../../utils/osm/relationType";

function InsertMemberItem({ id, type }: FeatureRefObj) {
    const meta = useOSMMapStore(state => state.meta[type][id])
    const metatype = useMemo(() => {
        if (meta?.tag?.length) {
            if (type === "node") {
                return getNodeType(meta.tag)
            } else if (type === "relation") {
                return getRelationType(meta.tag)
            }
        }
        return undefined;
    }, [meta?.tag, type])

    return <ItemBaseDisplay
        featuretype={type}
        id={id}
        metatype={metatype}
        fullname={getName(meta.tag)}
        created={Number(meta["@_id"]) < 0}
        deleted={meta["@_action"] === "delete"}
        modified={meta["@_action"] === "modify"}
    />
}

function InsertMember({ handelInsertTop, handelIntertBottom, handelInsertAtActive }: {
    handelInsertTop: InsertHandeler,
    handelIntertBottom: InsertHandeler,
    handelInsertAtActive: InsertHandeler
}) {
    const selectedComponent = useOSMMapStore(useShallow(state => state.selectedRef));
    const [localSel, setlocalSel] = useState<FeatureRefObj[]>([])

    const handelClick = ({ id, type }: FeatureRefObj) => (
        localSel.some(item => item.id === id && item.type === type) ?
            setlocalSel(localSel.filter(item => !(item.id === id && item.type === type)))
            :
            setlocalSel([{ id: id, type: type }, ...localSel])
    )
    const getSelected = () => selectedComponent.filter(id => localSel.some(item => item.id === id.id && item.type === id.type))
    useEffect(() => {
        setlocalSel(localSel => localSel.filter(i => selectedComponent.includes(i)))
    }, [selectedComponent])
    return <div className="flex flex-row justify-center max-h-96 bg-base-100 p-2 rounded-md ">
        <div className="join join-vertical">
            <button
                className="btn btn-xs join-item"
                onClick={() => { handelInsertTop(getSelected()); setlocalSel([]) }}
            >
                InsTop
            </button>
            <button
                className="btn btn-xs join-item"
                onClick={() => { handelInsertAtActive(getSelected()); setlocalSel([]) }}
            >
                InsAct
            </button>
            <button
                className="btn btn-xs join-item"
                onClick={() => { handelIntertBottom(getSelected()); setlocalSel([]) }}
            >
                InsBtm
            </button>
        </div>

        <ul className="menu bg-base-200 menu-xs max-h-full overflow-scroll">
            {selectedComponent.map((item) => {
                return (<li key={`${item.type}-${item.id}`}>
                    <span onClick={() => handelClick(item)} className={`${localSel.some(i => i.id === item.id && i.type === item.type) && 'active'}`}>
                        <InsertMemberItem {...item} />
                    </span>
                </li>
                )
            })}
        </ul>
    </div>
}

export default InsertMember;