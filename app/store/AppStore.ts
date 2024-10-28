import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"

// Typescript interface for this store slice
export interface AppStore {
  hasPreferences?: boolean
  setHasPreferences: (val: boolean) => void
}

// create our store slice with default data and actions
export const createAppSlice: StateCreator<RootStore, [], [], AppStore> = (set) => ({
  hasPreferences: undefined,
  setHasPreferences: (value) => set({ hasPreferences: value }),
})

// a selector can be used to grab the full AuthenticationStore
export const appStoreSelector = (state: RootStore) => ({
  hasPreferences: state.hasPreferences,
  setHasPreferences: state.setHasPreferences,
})
