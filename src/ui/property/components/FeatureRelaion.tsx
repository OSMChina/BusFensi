import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../../logic/model/store";
import { T2Arr } from "../../../utils/helper/object";
import { getPropFromTags } from "../../../utils/osm/getTag";

function FeatureRelation({ id, type }: { id: string; type: "node" | "way" | "relation"; }) {
    const setSelectedComponent = useBearStoreWithUndo((state) => state.PIXIComponentSelectAction)
    const { relations, ways } = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta))
    const relationArray = Object.keys(relations).filter(key => Object.prototype.hasOwnProperty.call(relations, key)).map(key => relations[key])
    //const wayArray = Object.keys(ways).filter(key => Object.prototype.hasOwnProperty.call(ways, key)).map(key => ways[key])
    const handelRelation = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, relationId: string) => {
        setSelectedComponent(relationId, !e.shiftKey)
    }

    return (
        <ul className="menu menu-xs">
            {relationArray
                .filter((relation) =>
                    T2Arr(relation.member).some(
                        (member) =>
                            (String(member["@_ref"]) === id) && (member["@_type"] === type)
                            || (type === "node"
                                && (
                                    (
                                        member["@_type"] === "way"
                                        && (
                                            ways[String(member["@_ref"])]
                                            && T2Arr(ways[String(member["@_ref"])].nd).some(nd => String(nd["@_ref"]) === id)
                                        )
                                    ) || (
                                        member["@_type"] === "relation"
                                        && (
                                            relations[String(member["@_ref"])]
                                            && T2Arr(relations[String(member["@_ref"])].member).some(member => String(member["@_ref"]) === id)
                                        )
                                    )
                                )
                            )
                    )
                )
                .map((relation) => (
                    <li
                        key={relation["@_id"]}
                        onClick={(e) => handelRelation(e, String(relation["@_id"]))}
                    >
                        {getPropFromTags("name", relation.tag) || relation["@_id"]}
                    </li>
                ))}
        </ul>
    );
}


export default FeatureRelation