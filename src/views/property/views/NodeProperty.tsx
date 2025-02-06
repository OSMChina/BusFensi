import { useShallow } from "zustand/react/shallow";
import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import FeatureRelation from "../components/FeatureRelaion";
import { T2Arr } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";

function NodeProperty({ id }: { id: NumericString }) {
    const meta = useOSMMapStore(useShallow((state) => state.meta.node[id]));
    const modifyNodeNoCommit = useOSMMapStore((state) => state.modifyFeatureMetaNC)
    const commitAction = useOSMMapStore(state => state.commit)
    if (!meta) {
        return null
    }
    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">Node {meta["@_id"]}</h3>
            <FeatureState id={id} type="node" />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { modifyNodeNoCommit("node", id, f => f.tag = tags) }} commitChange={commitAction} />
            <FeatureRelation id={id} type="node" />
        </div>
    );
}
export default NodeProperty  