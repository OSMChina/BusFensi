import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ItemBase from "../../../../../components/osm/outline/itemBase";
import { useOSMMapStore } from "../../../../../store/osmmeta";
import { FeatureTypes } from "../../../../../type/osm/refobj";
import { getName, getNodeType } from "../../../../../utils/osm/nodeType";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons/faLocationDot";
import { useMapViewStore } from "../../../../../store/mapview";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons/faCheckCircle";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { cn } from "../../../../../utils/helper/object";
import { useShallow } from "zustand/shallow";
import SimpleConfirm from "../../../../../components/modal/SimpleConfirmHook";
import { Node } from "../../../../../type/osm/meta";
import { FeatureTypeMap } from "../../../../../store/osmmeta/slice/meta/type";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons/faXmarkCircle";
import { createConfirmation } from "react-confirm";
import { ReactNode, useCallback, useMemo } from "react";
import { getRelationType } from "../../../../../utils/osm/relationType";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons/faClockRotateLeft";

export function FeatureItem<T extends FeatureTypes>({ type, meta, showMetaType, children }: {
    type: T, meta: FeatureTypeMap[T], showMetaType?: true,
    children?: (props: { type: T, meta: FeatureTypeMap[T] }) => ReactNode
}) {
    const id = meta["@_id"];
    const [selectFeature, unselectFeature, deleteFeature, restoreDeletedFeature] = useOSMMapStore(useShallow(state => [
        state.selectFeature,
        state.unSelectFeature,
        state.deleteFeature,
        state.restoreDeletedFeature
    ]));
    const setViewpoint = useMapViewStore(state => state.setViewpoint);
    const confirmModal = createConfirmation(SimpleConfirm);

    const metatype = useMemo(() => {
        if (showMetaType && meta.tag?.length) {
            if (type === "node") {
                return getNodeType(meta.tag);
            } else if (type === "relation") {
                return getRelationType(meta.tag);
            }
        }
        return undefined;
    }, [showMetaType, meta.tag, type]);

    const toggleSwitchPosition = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.stopPropagation();
        if (type === "node") {
            const node = meta as Node;
            setViewpoint({ lat: node["@_lat"], lon: node["@_lon"] });
        }
    }, [meta, setViewpoint, type]);

    const toggleSelection = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.stopPropagation();
        if (meta["@_localStates"]?.selected) {
            unselectFeature(type, id);
        } else {
            selectFeature(type, id, false);
        }
    }, [id, meta, selectFeature, type, unselectFeature]);

    const toggleDelete = useCallback<React.MouseEventHandler<HTMLButtonElement>>(async (e) => {
        e.stopPropagation();
        console.debug("deleting: ", type, id);
        const res = await confirmModal({
            title: "Confirm delete feature",
            message: "Are you sure you want delete this feature?\n" + (getName(meta.tag || []) || id)
        });
        console.debug("confirmed deleting: ", res, type, id);
        if (res) {
            deleteFeature(type, id);
        }
    }, [confirmModal, deleteFeature, id, meta.tag, type]);

    const isDeleted = meta["@_action"] === "delete";

    return (
        <ItemBase
            featuretype={type}
            id={id}
            metatype={metatype}
            fullname={getName(meta.tag)}
            created={Number(meta["@_id"]) < 0}
            deleted={isDeleted}
            modified={meta["@_action"] === "modify"}
        >
            {!isDeleted && (
                <>
                    {type === "node" && (
                        <button
                            className="btn btn-xs btn-square tooltip tooltip-bottom"
                            data-tip="Switch to position"
                            onClick={toggleSwitchPosition}
                        >
                            <FontAwesomeIcon icon={faLocationDot} />
                        </button>
                    )}
                    <button
                        className={cn("btn btn-xs btn-square tooltip tooltip-bottom", meta["@_localStates"]?.selected && "btn-accent")}
                        data-tip={meta["@_localStates"]?.selected ? "Unselect" : "Select"}
                        onClick={toggleSelection}
                    >
                        <FontAwesomeIcon icon={meta["@_localStates"]?.selected ? faXmarkCircle : faCheckCircle} />
                    </button>
                    <button
                        className="btn btn-xs btn-square tooltip tooltip-bottom"
                        data-tip="Delete"
                        onClick={toggleDelete}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </>
            )}
            {isDeleted && (
                <button
                    className="btn btn-xs btn-square tooltip tooltip-bottom"
                    data-tip="Restore"
                    onClick={() => restoreDeletedFeature(type, id)}
                >
                    <FontAwesomeIcon icon={faClockRotateLeft} />
                </button>
            )}
            {children && children({ type, meta })}
        </ItemBase>
    );
}