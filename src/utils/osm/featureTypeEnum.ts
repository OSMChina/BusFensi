export enum NODE_TYPES {
    BUS_STOP="bus stop",
    STOP_POSITION="stop posistion",
}

export enum WAY_TYPES {}

export enum RELATION_TYPES {
    ROUTE="route",
    ROUTE_MASTER="route master",
    STOP_AREA="stop area"
}

export const FEATURE_TYPES = {
    ...NODE_TYPES,
    ...WAY_TYPES,
    ...RELATION_TYPES,
} as const;

export type TYPE_ENUM_MAP =  {
    node: NODE_TYPES,
    way: WAY_TYPES,
    relation: RELATION_TYPES
}