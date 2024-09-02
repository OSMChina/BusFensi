import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../../logic/model/store";
import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import FeatureRelation from "../components/FeatureRelaion";
import { T2Arr, deepCopy } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";

function NodeProperty({ id }: { id: string }) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.nodes[id]));
    const modifyNodeNoCommit = useBearStoreWithUndo((state) => state.modifyNodeNoCommit)
    const commitAction = useBearStoreWithUndo(state => state.commitAction)
    return (
        <div className="p-4 border rounded-lg bg-base-200 shadow-md">
            <h3 className="text-xl font-semibold mb-4">Node {meta["@_id"]}</h3>
            <FeatureState id={id} />
            <Attributes meta={meta} />
            <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyNodeNoCommit(id, metaNew) }} commitChange={commitAction} />
            <FeatureRelation id={id} type="node" />
        </div>
    );
}
export default NodeProperty  