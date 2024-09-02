import useBearStoreWithUndo from "../../logic/model/store";
import NodeProperty from "./views/NodeProperty";
import WayProperty from "./views/WayProperty";
import RelationProperty from "./views/RelationProperty";

function PropertyView() {
  const [activeId, type] = useBearStoreWithUndo(state => {
    const id = state.selectedComponent[0]
    if (id !== undefined) {
      return [id, state.renderedOSMFeatureMeta.id2type[id]]
    } else {
      return [undefined, undefined]
    }
  });

  let child;
  if (typeof activeId === "string") {
    if (type === "node") {
      child = <NodeProperty id={activeId} />
    } else if (type === "way") {
      child = <WayProperty id={activeId} />
    } else {
      child = <RelationProperty id={activeId} />
    }
  } else {
    child = <span>{"please select some components to edit"}</span>
  }

  return <div className="property-view min-h-1/2 h-1/2 max-h-1/2 w-full max-w-full flex flex-col p-1 rounded bg-base-100 overflow-x-scroll overflow-y-scroll">
    {child}
  </div>
}

export default PropertyView