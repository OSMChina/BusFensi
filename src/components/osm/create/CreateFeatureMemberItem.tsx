import { ItemBaseDisplay } from "../outline/itemBase";
import { useOSMMapStore } from "../../../store/osmmeta";
import { FeatureTypes, NumericString } from "../../../type/osm/refobj";
import { getName, getNodeType } from "../../../utils/osm/nodeType";
import { useShallow } from "zustand/shallow";
import {  ReactNode, useMemo } from "react";
import { getRelationType } from "../../../utils/osm/relationType";

export default function CreateFeatureMemberItem({ type, id, showMetaType, children }: {
    type: FeatureTypes, id: NumericString, showMetaType?: true,
    children?: (props: { type: FeatureTypes, id: NumericString }) => ReactNode
}) {
    const meta = useOSMMapStore(useShallow(state => state.meta[type][id]))
    const metatype = useMemo(() => {
        if (showMetaType && meta?.tag?.length) {
            if (type === "node") {
                return getNodeType(meta.tag)
            } else if (type === "relation") {
                return getRelationType(meta.tag)
            }
        }
        return undefined;
    }, [showMetaType, meta?.tag, type])

    return <div className="flex text-xs flex-1 flex-row items-center px-1 ml-1 gap-1"><ItemBaseDisplay
        featuretype={type}
        id={id}
        metatype={metatype}
        fullname={getName(meta.tag)}
        created={Number(meta["@_id"]) < 0}
        deleted={meta["@_action"] === "delete"}
        modified={meta["@_action"] === "modify"}
    >
        {children && children({ type, id })}
    </ItemBaseDisplay>
    </div>
}

