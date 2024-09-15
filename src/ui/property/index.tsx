import useBearStoreWithUndo from "../../logic/model/store";
import NodeProperty from "./views/NodeProperty";
import WayProperty from "./views/WayProperty";
import RelationProperty from "./views/RelationProperty";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../utils/helper/object";
import { ItemRefObj } from "../../logic/model/type";

function PropertyView() {
  const selected = useBearStoreWithUndo(useShallow(state => state.selectedComponent))
  const [activeItem, setActive] = useState<ItemRefObj | undefined>(selected[0])
  useEffect(() => {
    if (!activeItem && selected.length > 0) {
      setActive(selected[0])
    } else if (activeItem && !selected.some(item => item.id === activeItem.id && item.type === activeItem.type)) {
      setActive(undefined)
    }
  }, [selected, activeItem, setActive])

  return <div className="property-view min-h-1/2 h-1/2 max-h-1/2 w-full max-w-full flex flex-col p-1 rounded bg-base-100">
    <div className="max-w-full overflow-x-scroll">
      <div role="tablist" className="tabs tabs-lifted tabs-xs">
        {selected.map(item => (
          <a
            key={`${item.type}-${item.id}`}
            role="tab"
            className={cn(
              "tab",
              (activeItem && item.id === activeItem.id && item.type === activeItem.type) && "tab-active"
            )} onClick={() => setActive(item)}
          >
            {`${item.type}-${item.id}`}
          </a>
        ))}
      </div>
    </div>

    {activeItem ?
      (activeItem.type === "node" ?
        <NodeProperty id={activeItem.id} />
        : activeItem.type === "way" ?
          <WayProperty id={activeItem.id} />
          : activeItem.type === "relation" ?
            <RelationProperty id={activeItem.id} />
            : <div>Unknown type for item {JSON.stringify(activeItem)}</div>
      )
      : <div>Please select some component to show prop edit view </div>
    }
  </div>
}

export default PropertyView