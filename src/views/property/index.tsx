import NodeProperty from "./views/NodeProperty";
import WayProperty from "./views/WayProperty";
import RelationProperty from "./views/RelationProperty";
import { useOSMMapStore } from "../../store/osmmeta";

function PropertyView({ width, height }: {
  width: number,
  height: number
}) {
  const activeItem = useOSMMapStore(state => state.activeRef)

  return <div style={{ width, height, maxWidth: width, maxHeight: height }} className="property-view flex flex-col p-1 rounded bg-base-100">

    {activeItem ?
      (activeItem.type === "node" ?
        <NodeProperty id={activeItem.id} />
        : activeItem.type === "way" ?
          <WayProperty id={activeItem.id} />
          : activeItem.type === "relation" ?
            <RelationProperty id={activeItem.id} />
            : <div>Unknown type for item {JSON.stringify(activeItem)}</div>
      )
      : <div>Please active some component to show prop edit view</div>
    }
  </div>
}

export default PropertyView