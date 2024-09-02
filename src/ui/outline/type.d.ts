import { Node, Relation, Way } from "../../api/osm/type";

export type filterFunc = (meta: Node | Way | Relation, type: "node" | "way" | "relation") => boolean