import { StateCreator } from "zustand"
import { RootStore } from "./RootStore"
import { AuthChangeEvent, User } from "@supabase/supabase-js"

// Typescript interface for this store slice
export interface AuthenticationStore {
  authToken?: string
  authRefreshToken?: string
  oauthToken?: string
  oauthRefreshToken?: string
  user?: User
  authState?: AuthChangeEvent | undefined
  setAuthToken: (value?: string) => void
  setAuthRefreshToken: (value?: string) => void
  setOAuthToken: (value?: string) => void
  setOAuthRefreshToken: (value?: string) => void
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
  setOAuthToken: (value) => set({ oauthToken: value }),
  setOAuthRefreshToken: (value) => set({ oauthRefreshToken: value }),
  setAuthState: (value) => set({ authState: value }),
  setUser: (value) => set({ user: value }),
  logout: () =>
    set({
      authToken: undefined,
      authRefreshToken: undefined,
      user: undefined,
      setOAuthRefreshToken: undefined,
      setOAuthToken: undefined,
    }),
})

// a selector can be used to grab the full AuthenticationStore
export const authenticationStoreSelector = (state: RootStore) => ({
  authState: state.authState,
  authToken: state.authToken,
  oauthToken: state.oauthToken,
  authRefreshToken: state.authRefreshToken,
  oauthRefreshToken: state.oauthRefreshToken,
  user: state.user,
  isAuthenticated: isAuthenticatedSelector(state),
  setAuthToken: state.setAuthToken,
  setAuthRefreshToken: state.setAuthRefreshToken,
  setOAuthToken: state.setOAuthToken,
  setOAuthRefreshToken: state.setOAuthRefreshToken,
  setUser: state.setUser,
  setAuthState: state.setAuthState,
  logout: state.logout,
})

// selectors can also be used for derived values
export const isAuthenticatedSelector = (state: RootStore) => !!state.authToken
