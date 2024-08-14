import { useShallow } from "zustand/react/shallow"
import useBearStoreWithUndo from "../../logic/model/store"
import { Node, Relation, Tag, Way } from "../../api/osm/type"
import { T2Arr } from "../../utils/helper/object";
import { getPropFromTags } from "../../utils/osm/getTag";

function Attributes({ meta }: { meta: Node | Way | Relation }) {
    return (
        <ul>
            {Object.keys(meta)
                .filter(
                    (key) =>
                        Object.prototype.hasOwnProperty.call(meta, key) && key.startsWith('@_')
                )
                .map((key) => (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <li key={key}> <span>{key}</span> : <span>{(meta as any)[key]}</span></li>
                ))}
        </ul>
    );
}

function Tags({ tags, setTags }: {
    tags: Tag[]
    setTags: (tags: Tag[]) => void
}) {
    return <ul>
        {tags
            .map((tag, index) => {
                const handelK = (k: string) => {
                    tags[index]["@_k"] = k;
                }
                const handelV = (v: string) => {
                    tags[index]["@_v"] = v
                }
                return <li>
                    <label className="input input-bordered flex items-center gap-2">
                        <input contentEditable={true} defaultValue={tag["@_k"]} onChange={e => handelK(e.target.value)}></input>
                        <input type="text" className="grow" defaultValue={tag["@_v"]} onChange={e => handelV(e.target.value)} />
                    </label>
                    <button onClick={() => setTags(tags.filter((_, index_) => index === index_))} >Delete</button>
                </li>
            }
            )}
        <li>
            <button onClick={() => setTags(tags)} >Save</button>
            <button onClick={() => { tags.push({ "@_k": "", "@_v": "" }); setTags(tags) }}>add</button>
        </li>
    </ul>
}

function FeatureRelation({ id, type, relations }: {
    id: string,
    type: "node" | "way" | "relation"
    relations: Relation[]
}) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function handelRelation(relationId: number) {

    }
    return (<ul>
        {...relations.filter(
            relation => T2Arr(relation.member)
                .some(
                    member => String(member["@_ref"]) === id && member["@_type"] === type))
            .map(relation => <li onClick={() => handelRelation(relation["@_id"])}>{getPropFromTags("name", relation.tag)}</li>)
        }
    </ul>)
}

function NodeProperty({ id }: {
    id: string
}) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.nodes[id]))
    const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]))

    return <div>
        <h3>Node {meta["@_id"]}</h3>
        {Object.keys(status)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter(key => (status as any)[key])
            .map(key => <span className="badge">{key}</span>)
        }
        <Attributes meta={meta} />
        <Tags tags={T2Arr(meta.tag)} setTags={()=>{}} />
    </div>
}

function WayProperty({ id }: {
    id: string
}) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.ways[id]))
    const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]))
    return <div>
        <h3>Way {meta["@_id"]}</h3>
        {Object.keys(status)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter(key => (status as any)[key])
            .map(key => <span className="badge">{key}</span>)
        }
        <Attributes meta={meta} />
        <Tags tags={T2Arr(meta.tag)} setTags={()=>{}} />
        <ul>
            {...T2Arr(meta.nd).map(nd => <li>{nd["@_ref"]}</li>)}
        </ul>
    </div>
}

function RelationProperty({ id }: {
    id: string
}) {
    const meta = useBearStoreWithUndo(useShallow((state) => state.renderedOSMFeatureMeta.relations[id]))
    const status = useBearStoreWithUndo(useShallow((state) => state.renderedFeatureState[id]))
    return <div>
        <h3>Relation {meta["@_id"]}</h3>
        {Object.keys(status)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter(key => (status as any)[key])
            .map(key => <span className="badge">{key}</span>)
        }
        <Attributes meta={meta} />
        <Tags tags={T2Arr(meta.tag)} setTags={()=>{}} />
        <ul>
            {...T2Arr(meta.member).map(member => <li>{member["@_ref"]}</li>)}
        </ul>
    </div>
}