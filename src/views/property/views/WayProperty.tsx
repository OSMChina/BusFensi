import { useShallow } from "zustand/react/shallow";

import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import FeatureRelation from "../components/FeatureRelaion";
import { cn, T2Arr } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import { useCallback, useState } from "react";
import { FeatureRefObj as ItemRefObj } from "../../../type/osm/refobj"
import InsertMember from "./InsertMember";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";
import { InsertHandeler } from "../../../type/view/property/type";
import MemberListSelectDelDown from "../components/MemberListSelWithDelDown";
import { Nd } from "../../../type/osm/meta";
import MemberItem from "../../../components/osm/memberDrag/MemberItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { faCircle as faCircleSolid } from "@fortawesome/free-solid-svg-icons/faCircle";
import { getName } from "../../../utils/osm/nodeType";


function WayProperty({ id }: { id: NumericString }) {
    const meta = useOSMMapStore(useShallow((state) => state.meta.way[id]));
    const modifyFeatureMetaNC = useOSMMapStore((state) => state.modifyFeatureMetaNC);
    const commitAction = useOSMMapStore(state => state.commit);

    const [localActiveNd, setLocalActive] = useState<ItemRefObj | undefined>(undefined)

    const memberItemRender = useCallback(({ member, children }: { member: Nd; children: React.ReactNode; overlay?: true; }) => <MemberItem
        id={member["@_ref"]}
        type={"node"}
    >
        {() => {
            const localA = localActiveNd?.id === member["@_ref"]
            return <>
                <button className={cn("btn btn-square btn-xs tooltip tooltip-bottom", localA && "btn-accent")}
                    data-tip="Mark as local active place to insert"
                    onMouseDown={(event) => {
                        event.stopPropagation();
                        if (localA) {
                            setLocalActive(undefined)
                        } else {
                            setLocalActive({ id: member["@_ref"], type: "node" })
                        }
                    }}>
                    <FontAwesomeIcon icon={localA ? faCircleSolid : faCircle} />
                </button>
                {children}
            </>
        }}
    </MemberItem>, [localActiveNd?.id])

    const memberToId = useCallback((m:Nd) => `nd-${m["@_ref"]}`,[])

    if (!meta) {
        return null
    }

    function handleDragStart() {
        commitAction();
    }

    function handleDragEnd(nd: Nd[]) {
        modifyFeatureMetaNC("way", id, w => {
            w.nd = nd
        });
    }

    function handleDelete(nd: Nd[]) {
        modifyFeatureMetaNC("way", id, w => {
            w.nd = nd
        })
    }

    const itemsToNd = (items: {
        id: NumericString,
        type: "way" | "node" | "relation"
    }[]) => items.filter(i => i.type === "node").map(item => ({ '@_ref': item.id }))

    const handleInsertTop: InsertHandeler = (items) => {
        console.log("Insert at Top: ", items);
        commitAction()
        modifyFeatureMetaNC("way", id, w => {
            w.nd = [...itemsToNd(items), ...T2Arr(meta.nd)]
        })
    };

    const handleInsertBottom: InsertHandeler = (items) => {
        console.log("Insert at Bottom: ", items);
        commitAction()
        modifyFeatureMetaNC("way", id, w => {
            w.nd = [...T2Arr(meta.nd), ...itemsToNd(items)]
        })
    };

    const handleInsertAtActive: InsertHandeler = (items) => {
        console.log("Insert at Active: ", items);
        if (!localActiveNd) {
            handleInsertBottom(items)
        } else {
            const ndArray = [...T2Arr(meta.nd)];
            const insertIndex = ndArray.findIndex(m => m["@_ref"] === localActiveNd.id);
            ndArray.splice(insertIndex + 1, 0, ...itemsToNd(items));
            commitAction();
            modifyFeatureMetaNC("way", id, w => {
                w.nd = ndArray
            });
        }
    };

    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">[Way] {getName(meta.tag) ||  meta["@_id"]}</h3>
            <FeatureState id={id} type="way" />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { modifyFeatureMetaNC("way", id, w => w.tag = tags) }} commitChange={commitAction} />
            <div className="flex flex-row">
                <div className="bg-base-200">
                    <MemberListSelectDelDown
                        member={meta.nd}
                        memberToId={memberToId}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDelete={(_, after) => handleDelete(after)}
                    >
                        {memberItemRender}
                    </MemberListSelectDelDown>

                </div>
                <div className="">
                    <InsertMember
                        handelInsertTop={handleInsertTop}
                        handelIntertBottom={handleInsertBottom}
                        handelInsertAtActive={handleInsertAtActive}
                    />
                </div>
            </div>
            <FeatureRelation id={id} type="way" />
        </div>
    );
}

export default WayProperty;
