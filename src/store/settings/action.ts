import { StateCreator } from "zustand";
import { SettingsStore } from "./store";

export interface SettingsAction {
    updateSettingsAction: (newSettings: Partial<SettingsStore>) => void
}

export const createSettingsActionSlice: StateCreator<
    SettingsStore,
    [["zustand/devtools", never], ["zustand/persist", unknown]],
    [],
    SettingsAction
> = (set) => ({
    updateSettingsAction: (newSettings: Partial<SettingsStore>) => set(() => newSettings),
})
