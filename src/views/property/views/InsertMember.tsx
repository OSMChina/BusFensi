import { useShallow } from "zustand/react/shallow"
import { useCallback, useMemo, useRef } from "react";
import { InsertHandeler } from "../../../type/view/property/type";
import { FeatureRefObj } from "../../../type/osm/refobj";
import { useOSMMapStore } from "../../../store/osmmeta";
import { ItemBaseDisplay } from "../../../components/osm/outline/itemBase";
import { getName, getNodeType } from "../../../utils/osm/nodeType";
import { getRelationType } from "../../../utils/osm/relationType";
import BaseListSelect from "../../../components/dnd/BaseSelect";
import { UniqueIdentifier } from "@dnd-kit/core";

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
    const memberToId = useCallback((f: FeatureRefObj) => `${f.type}-${f.id}`, [])
    const localSelectionRef = useRef<Set<UniqueIdentifier>>(new Set())
    const getSelected = () => selectedComponent.filter(item => localSelectionRef.current.has(memberToId(item)))

    const renderChild = useCallback(({ member, memberToId, slot }: { member: FeatureRefObj[]; memberToId: (member: FeatureRefObj) => UniqueIdentifier; slot: (props: { m: FeatureRefObj; }) => React.ReactNode; }) => (
        member.map(item => <div key={memberToId(item)} className="flex flex-row gap-1 px-2 mt-1">
            <InsertMemberItem {...item} />
            {slot({ m: item })}
        </div>)
    ), [])
    return <div className="flex flex-row justify-center p-2 rounded-md">
        <div className="join join-vertical mr-2">
            <button
                type="button"
                className="btn btn-xs join-item"
                onClick={() => { handelInsertTop(getSelected()); }}
            >
                InsTop
            </button>
            <button
                type="button"
                className="btn btn-xs join-item"
                onClick={() => { handelInsertAtActive(getSelected()); }}
            >
                InsAct
            </button>
            <button
                type="button"
                className="btn btn-xs join-item"
                onClick={() => { handelIntertBottom(getSelected()); }}
            >
                InsBtm
            </button>
        </div>

        <div className="bg-base-200 text-xs rounded max-h-full">
            <BaseListSelect
                member={selectedComponent}
                memberToId={memberToId}
                slotSelection={({ selected, children }) => {
                    localSelectionRef.current = selected
                    return <div className="flex flex-row px-2 py-1">
                        <h3 className="text text-sm font-semibold">selected Items to insert</h3>
                        <div className="ml-auto" />
                        {children}
                    </div>;
                }}
            >
                {renderChild}
            </BaseListSelect>

        </div>
    </div>
}

export default InsertMember;