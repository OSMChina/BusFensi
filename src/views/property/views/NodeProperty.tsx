import { useShallow } from "zustand/react/shallow";
import Tags from "../components/Tags";
import Attributes from "../components/Attributes";
import FeatureRelation from "../components/FeatureRelaion";
import { cn, T2Arr } from "../../../utils/helper/object";
import FeatureState from "../components/FeatureStates";
import { useOSMMapStore } from "../../../store/osmmeta";
import { NumericString } from "../../../type/osm/refobj";
import { getName } from "../../../utils/osm/nodeType";
import { useMemo, useState } from "react";

function NodeProperty({ id }: { id: NumericString }) {
    const [activeTab, setActiveTab] = useState(0);
    const meta = useOSMMapStore(useShallow((state) => state.meta.node[id]));
    const modifyNodeNoCommit = useOSMMapStore((state) => state.modifyFeatureMetaNC)
    const commitAction = useOSMMapStore(state => state.commit)

    const nodeTab = useMemo(
        () => [
          {
            title: "Info",
            tab: () => <Attributes meta={meta} />,
          },
          {
            title: "Tags",
            tab: () => (
              <Tags
                tags={T2Arr(meta.tag)}
                setTags={(tags) => {
                  modifyNodeNoCommit("node", id, (f) => (f.tag = tags));
                }}
                commitChange={commitAction}
              />
            ),
          },
          {
            title: "Members",
            tab: () => <FeatureRelation id={id} type="node" />,
          },
        ],
        [meta, id, modifyNodeNoCommit, T2Arr, commitAction]
    );
    if (!meta) {
        return null
    }
    return (
        <div className="p-2 overflow-scroll">
            <h3 className="text-base font-semibold mb-2">[Node] {getName(meta.tag) || meta["@_id"]}</h3>
            <FeatureState id={id} type="node" />
            <div role="tablist" className="tabs tabs-lifted tabs-xs py-4">
               {nodeTab.map((tab, index) => (
                   <a
                        key={index}
                        onClick={() => setActiveTab(index)}
                        role="tab"
                        className={cn("tab", index === activeTab && "tab-active")}
                   >
                     {tab.title}
                  </a>
                ))}
            </div>
            <div className="outline-view flex flex-col bg-base-100 w-full px-1 flex-1 overflow-auto">
               {nodeTab[activeTab].tab()}
            </div>
        </div>
    );
}
export default NodeProperty  