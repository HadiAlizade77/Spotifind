import { create } from "zustand"
import { useShallow } from "zustand/react/shallow"
import { persist, createJSONStorage } from "zustand/middleware"

import {
  AuthenticationStore,
  authenticationStoreSelector,
  createAuthenticationSlice,
} from "./AuthenticationStore"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppStore, appStoreSelector, createAppSlice } from "./AppStore"

export interface RootStore extends AuthenticationStore, AppStore {
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useStore = create<RootStore>()(
  persist(
    (...a) => ({
      ...createAuthenticationSlice(...a),
      ...createAppSlice(...a),
      // add your state slices here

      _hasHydrated: false,
      setHasHydrated: (state) => {
        const set = a[0]
        set({
          _hasHydrated: state,
        })
      },
    }),
    {
      name: "zustand-app",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export const useAuthenticationStore = () => useStore(useShallow(authenticationStoreSelector))
export const useAppStore = () => useStore(useShallow(appStoreSelector))
