import { ComponentProps } from "react";
import { Node, Relation, Way } from "../../type/osm/meta";
import { FeatureList } from "../../../views/map/components/collection/base/list";

export type FilterFunc = (meta: Node | Way | Relation, type: "node" | "way" | "relation") => boolean

export type OutlineCollectionProps =  {
    filter?: FilterFunc
}
