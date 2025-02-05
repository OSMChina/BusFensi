import { useMapViewStore } from "../../store/mapview";
import { useOSMMapStore } from "../../store/osmmeta"
import { useSettingsStore } from "../../store/settings";

export interface BaseEvent {
    type: string
}

export type StoreType = {
    meta: typeof useOSMMapStore;
    view: typeof useMapViewStore
    settings: typeof useSettingsStore
}

export type BaseContext = {
    store: StoreType
}
