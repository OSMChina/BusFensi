import { FeatureTypes } from "../../api/osm/type";

export type InsertHandeler = (items: { id: string, type: FeatureTypes }[]) => void

