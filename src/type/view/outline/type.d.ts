import { Node, Relation, Way } from "../../type/osm/meta";

export type FilterFunc = (meta: Node | Way | Relation, type: "node" | "way" | "relation") => boolean

export type OutlineCollectionProps =  {
    filter?: FilterFunc
}
