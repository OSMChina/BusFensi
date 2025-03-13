import { useShallow } from "zustand/react/shallow";
import { T2Arr, typedKeys } from "../../../utils/helper/object";
import { useOSMMapStore } from "../../../store/osmmeta";
import { FeatureRefObj, NumericString } from "../../../type/osm/refobj";
import MemberItem from "../../../components/osm/memberDrag/MemberItem";

function FeatureRelation({ id, type }: FeatureRefObj) {
    const setSelectedComponent = useOSMMapStore((state) => state.selectFeature)
    const { relation, way } = useOSMMapStore(useShallow((state) => state.meta))
    const relationArray = typedKeys(relation).filter(key => Object.prototype.hasOwnProperty.call(relation, key)).map(key => relation[key])
    //const wayArray = Object.keys(ways).filter(key => Object.prototype.hasOwnProperty.call(ways, key)).map(key => ways[key])
    const handelRelation = (relationId: NumericString) => {
        setSelectedComponent("relation", relationId, false)
    }

    return (
        <ul className="menu menu-xs">
            {relationArray
                .filter((r) =>
                    T2Arr(r.member).some(
                        (member) =>
                            (member["@_ref"] === id) && (member["@_type"] === type)
                            || (type === "node"
                                && (
                                    (
                                        member["@_type"] === "way"
                                        && (
                                            way[member["@_ref"]]
                                            && T2Arr(way[member["@_ref"]].nd).some(nd => String(nd["@_ref"]) === id)
                                        )
                                    ) || (
                                        member["@_type"] === "relation"
                                        && (
                                            relation[member["@_ref"]]
                                            && T2Arr(relation[member["@_ref"]].member).some(member => member["@_ref"] === id)
                                        )
                                    )
                                )
                            )
                    )
                )
                .map((relation) => (
                    <li
                        key={relation["@_id"]}
                    >
                        <span onClick={() => handelRelation(relation["@_id"])}>
                            <MemberItem id={relation["@_id"]} type="relation" showMetaType />
                        </span>
                    </li>
                ))}
        </ul>
    );
}


export default FeatureRelation