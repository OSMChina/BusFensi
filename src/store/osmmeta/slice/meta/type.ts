import { WritableDraft } from "immer";
import { FeatureTypes, NumericString } from "../../../../type/osm/refobj";
import { Node, Way, Relation } from "../../../../type/osm/meta";
import { OSMMapStore } from "../../store";

type WritableNode = WritableDraft<Pick<Node, "@_lon" | "@_lat" | "tag">>
type WritableWay = WritableDraft<Pick<Way, "nd" | "tag">>
type WritableRelation = WritableDraft<Pick<Relation, "member" | "tag">>

export type FeatureTypeMap = {
    node: Node;
    way: Way;
    relation: Relation;
}

export type WritableFeatureTypeMap = {
    node: WritableDraft<Node>;
    way: WritableDraft<Way>;
    relation: WritableDraft<Relation>;
}

type HandlerTypeMap = {
    node: WritableNode;
    way: WritableWay;
    relation: WritableRelation;
}

export type AddFeatureMetaBatchFunction = <T extends FeatureTypes>(
    type: T,
    feature: FeatureTypeMap[T] | FeatureTypeMap[T][]
) => void;

export type ModifyFeatureMetaFunction = <T extends FeatureTypes>(
    type: T,
    id: NumericString,
    modify: (feature: HandlerTypeMap[T]) => void
) => void;

export type ModifyFeatureMetaHelper = <T extends FeatureTypes>(
    state: WritableDraft<OSMMapStore>,
    type: T,
    id: NumericString,
    modify: (feature: HandlerTypeMap[T]) => void
) => void;

