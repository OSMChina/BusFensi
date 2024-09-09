import useBearStoreWithUndo from "../../logic/model/store";
import NodeProperty from "./views/NodeProperty";
import WayProperty from "./views/WayProperty";
import RelationProperty from "./views/RelationProperty";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../utils/helper/object";

function PropertyView() {
  const selected = useBearStoreWithUndo(useShallow(state => state.selectedComponent))
  const id2type = useBearStoreWithUndo(useShallow(state => state.renderedOSMFeatureMeta.id2type))
  const [activeId, setActiveId] = useState<string | undefined>(selected[0])
  useEffect(() => {
    if (!activeId && selected.length > 0) {
      setActiveId(selected[0])
    } else if (activeId && !selected.includes(activeId)) {
      setActiveId(undefined)
    }
  }, [selected, activeId, setActiveId])

  return <div className="property-view min-h-1/2 h-1/2 max-h-1/2 w-full flex flex-col p-1 rounded bg-base-100">
    <div role="tablist" className="tabs tabs-lifted tabs-xs">
      {selected.map(id => (
        <a key={id} role="tab" className={cn("tab", id === activeId && "tab-active")} onClick={() => setActiveId(id)}>{id}</a>
      ))}
    </div>
    {activeId ?
      (id2type[activeId] === "node" ?
        <NodeProperty id={activeId} />
        : id2type[activeId] === "way" ?
          <WayProperty id={activeId} />
          : id2type[activeId] === "relation" ?
            <RelationProperty id={activeId} />
            : <div>Unknown type for id {activeId}</div>
      )
      : <div>Please select some component to show prop edit view </div>
    }
  </div>
}

export default PropertyView