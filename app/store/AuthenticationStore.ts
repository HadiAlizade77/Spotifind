import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"
import { AuthChangeEvent, User } from "@supabase/supabase-js"

// Typescript interface for this store slice
export interface AuthenticationStore {
  authToken?: string
  authRefreshToken?: string
  user?: User
  authState?: AuthChangeEvent | undefined
  setAuthToken: (value?: string) => void
  setAuthRefreshToken: (value?: string) => void
  setAuthState: (value?: AuthChangeEvent) => void
  setUser: (value: User) => void
  logout: () => void
}

// create our store slice with default data and actions
export const createAuthenticationSlice: StateCreator<RootStore, [], [], AuthenticationStore> = (
  set,
) => ({
  authState: undefined,
  authRefreshToken: undefined,
  authToken: undefined,
  user: undefined,
  setAuthToken: (value) => set({ authToken: value }),
  setAuthRefreshToken: (value) => set({ authRefreshToken: value }),
  setAuthState: (value) => set({ authState: value }),
  setUser: (value) => set({ user: value }),
  logout: () => set({ authToken: undefined, authRefreshToken: undefined, user: undefined }),
})

// a selector can be used to grab the full AuthenticationStore
export const authenticationStoreSelector = (state: RootStore) => ({
  authState: state.authState,
  authToken: state.authToken,
  authRefreshToken: state.authRefreshToken,
  authEmail: state.user,
  isAuthenticated: isAuthenticatedSelector(state),
  setAuthToken: state.setAuthToken,
  setAuthRefreshToken: state.setAuthRefreshToken,
  setUser: state.setUser,
  setAuthState: state.setAuthState,
  logout: state.logout,
})

// selectors can also be used for derived values
export const isAuthenticatedSelector = (state: RootStore) => !!state.authToken
