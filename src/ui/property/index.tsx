/* eslint-disable @typescript-eslint/no-explicit-any */
import { useShallow } from "zustand/react/shallow";
import useBearStoreWithUndo from "../../logic/model/store";
import { Node, Relation, Tag, Way } from "../../api/osm/type";
import { deepCopy, T2Arr } from "../../utils/helper/object";
import { getPropFromTags } from "../../utils/osm/getTag";

function Attributes({ meta }: { meta: Node | Way | Relation }) {
  return (
    <ul className="space-y-2">
      {Object.keys(meta)
        .filter(
          (key) =>
            Object.prototype.hasOwnProperty.call(meta, key) && key.startsWith("@_")
        )
        .map((key) => (
          <li key={key} className="flex justify-between p-2 bg-base-200 rounded-md shadow-sm">
            <span className="font-semibold">{key.substring(2)}</span>
            <span className="ml-2 text-base-content">{(meta as any)[key]}</span>
          </li>
        ))}
    </ul>
  );
}

function Tags({ tags, setTags, commitChange }: { tags: Tag[], setTags: (tags: Tag[]) => void, commitChange: () => void }) {
  const tagsNew = deepCopy(tags);

  const handleKeyChange = (index: number, newKey: string) => {
    tagsNew[index]["@_k"] = newKey;
    setTags([...tagsNew]);
  };

  const handleValueChange = (index: number, newValue: string) => {
    tagsNew[index]["@_v"] = newValue;
    setTags([...tagsNew]);
  };

  const handleBlur = () => {
    // This function is called when an input loses focus
    commitChange(); // Save changes on blur
  };
  const handleDelete = (index: number) => {
    const updatedTags = tagsNew.filter((_, i) => i !== index);
    setTags(updatedTags);
    commitChange()
  };

  const handleAdd = () => {
    setTags([...tagsNew, { "@_k": "", "@_v": "" }]);
    commitChange()
  };

  const handleSave = () => {
    setTags(tagsNew);
    commitChange()
  };

  return (
    <table className="table table-xs w-full max-w-full overflow-x-scroll">
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tagsNew.map((tag, index) => (
          <tr key={index}>
            <td>
              <input
                type="text"
                value={tag["@_k"]}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                onBlur={handleBlur}
                className="input input-bordered input-xs p-2 rounded-md border max-w-xs"
              />
            </td>
            <td>
              <input
                type="text"
                value={tag["@_v"]}
                onChange={(e) => handleValueChange(index, e.target.value)}
                onBlur={handleBlur}
                className="input input-bordered input-xs p-2 rounded-md border max-w-xs w-fit"
              />
            </td>
            <td>
              <button
                onClick={() => handleDelete(index)}
                className="btn btn-error btn-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3} className="flex gap-2">
            <button onClick={handleSave} className="btn btn-success btn-sm">
              Save
            </button>
            <button onClick={handleAdd} className="btn btn-primary btn-sm">
              Add
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

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

function NodeProperty({ id }: { id: string }) {
  const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.nodes[id]));
  const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]));
  const modifyNodeNoCommit = useBearStoreWithUndo((state) => state.modifyNodeNoCommit)
  const commitAction = useBearStoreWithUndo(state => state.commitAction)
  return (
    <div className="p-4 border rounded-lg bg-base-200 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Node {meta["@_id"]}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(status)
          .filter((key) => (status as any)[key])
          .map((key) => (
            <span key={key} className="badge badge-info">
              {key}
            </span>
          ))}
      </div>
      <Attributes meta={meta} />
      <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyNodeNoCommit(id, metaNew) }} commitChange={commitAction} />
      <FeatureRelation id={id} type="node" />
    </div>
  );
}

function WayProperty({ id }: { id: string }) {
  const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[id]));
  const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]));
  const modifyWayNoCommit = useBearStoreWithUndo((state) => state.modifyWayNoCommit)
  const commitAction = useBearStoreWithUndo(state => state.commitAction)

  return (
    <div className="p-4 border rounded-lg bg-base-100 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Way {meta["@_id"]}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(status)
          .filter((key) => (status as any)[key])
          .map((key) => (
            <span key={key} className="badge badge-info">
              {key}
            </span>
          ))}
      </div>
      <Attributes meta={meta} />
      <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyWayNoCommit(id, metaNew) }} commitChange={commitAction} />
      <ul className="mt-4 space-y-2">
        {T2Arr(meta.nd).map((nd) => (
          <li key={nd["@_ref"]} className="p-2 bg-base-200 rounded-md">
            {nd["@_ref"]}
          </li>
        ))}
      </ul>
      <FeatureRelation id={id} type="way" />
    </div>
  );
}

function RelationProperty({ id }: { id: string }) {
  const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.relations[id]));
  const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]));
  const { ways, nodes } = useBearStoreWithUndo(useShallow(state => state.renderedOSMFeatureMeta))
  const modifyRelationNoCommit = useBearStoreWithUndo((state) => state.modifyRelationNoCommit)
  const commitAction = useBearStoreWithUndo(state => state.commitAction)

  return (
    <div className="p-4 border rounded-lg bg-base-100 shadow-md">
      <h3 className="text-xl font-semibold mb-4">Relation {meta["@_id"]}</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(status)
          .filter((key) => (status as any)[key])
          .map((key) => (
            <span key={key} className="badge badge-info">
              {key}
            </span>
          ))}
      </div>
      <Attributes meta={meta} />
      <Tags tags={T2Arr(meta.tag)} setTags={(tags) => { const metaNew = deepCopy(meta); metaNew.tag = tags; modifyRelationNoCommit(id, metaNew) }} commitChange={commitAction} />
      <ul className="mt-4 menu menu-sm">
        {T2Arr(meta.member).map((member) => {
          if (member["@_type"] === "node") {
            return (
              <li key={member["@_ref"]}>
                {getPropFromTags("name", nodes[String(member["@_ref"])].tag)}
              </li>
            );
          } else if (member["@_type"] === "way") {
            return (
              <li key={member["@_ref"]}>
                {getPropFromTags("name", ways[String(member["@_ref"])].tag)}
              </li>
            );
          } else {
            return <li key={member["@_ref"]}>{String(member)}</li>;
          }
        })}
      </ul>
    </div>
  );
}

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