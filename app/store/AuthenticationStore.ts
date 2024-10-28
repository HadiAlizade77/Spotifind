import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"
import { User } from "@supabase/supabase-js"

// Typescript interface for this store slice
export interface AuthenticationStore {
  authToken?: string
  user?: User
  setAuthToken: (value?: string) => void
  setUser: (value: User) => void
  logout: () => void
}

// create our store slice with default data and actions
export const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (
  set,
) => ({
  authToken: undefined,
  user: undefined,
  setAuthToken: (value) => set({ authToken: value }),
  setUser: (value) => set({ user: value }),
  logout: () => set({ authToken: undefined, user: undefined }),
})

// a selector can be used to grab the full AuthenticationStore
export const authenticationStoreSelector = (state: RootStore) => ({
  authToken: state.authToken,
  authEmail: state.user,
  isAuthenticated: isAuthenticatedSelector(state),
  setAuthToken: state.setAuthToken,
  setUser: state.setUser,
  logout: state.logout,
})

// selectors can also be used for derived values
export const isAuthenticatedSelector = (state: RootStore) => !!state.authToken
