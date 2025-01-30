import { Node, Way, Relation } from "./meta";
export type FeatureTypes = "node" | "way" | "relation";

export interface LocalActionAttr {
    '@_action'?: "modify" | "delete",
    '@_localStates'?: FeatureState
}

export type NumericString = `${number}`;

export interface FeatureRefObj {
    type: FeatureTypes,
    id: NumericString,
}

export type NodesObj = Record<NumericString, Node>
export type WaysObj = Record<NumericString, Way>
export type RelationsObj = Record<NumericString, Relation>

export interface FeatureMetaGroup {
    node: NodesObj,
    way: WaysObj,
    relation: RelationsObj,
}

export interface FeatureState {
    visible: boolean
    active: boolean
    selected: boolean
    hovered: boolean
    highlighted: boolean
}

export type FeatureStateGroup = Record<FeatureTypes, Record<NumericString, FeatureState>>