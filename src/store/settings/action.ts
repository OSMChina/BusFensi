import { StateCreator } from "zustand";
import { SettingsStore } from "./store";

export interface SettingsAction {
    updateSettingsAction: (newSettings: Partial<SettingsStore>) => void
}

export const createMapStatusActionSlice: StateCreator<
    SettingsStore,
    [['zustand/devtools', never]],
    [],
    SettingsAction
> = (set) => ({
    updateSettingsAction: (newSettings: Partial<SettingsStore>) => set(() => newSettings),
})
