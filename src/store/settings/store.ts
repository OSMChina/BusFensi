import { create } from "zustand";
import { createSettingsActionSlice, SettingsAction } from "./action";
import { initialState, SettingsState } from "./initialState";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type SettingsStore = SettingsAction & SettingsState

const storageOptions = {
    name: 'settingStore',
    storage: createJSONStorage<SettingsStore>(() => localStorage),
}

// Apply the store creation with the correct middleware order
export const useSettingsStore = create<SettingsStore>()(
    devtools(
        persist((...parameters) => ({
            ...initialState,
            ...createSettingsActionSlice(...parameters),
        }), storageOptions),  // devtools applied after persist
        { name: 'Settings' },
    ),
);