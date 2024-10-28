import { ComponentProps, useContext, useEffect } from "react"
/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import * as Screens from "@/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useAppTheme, useThemeProvider } from "@/utils/useAppTheme"
import { LoginScreen } from "@/screens/LoginScreen"
import { useAppStore, useAuthenticationStore } from "@/store/RootStore"
import { supabase } from "@/utils/supabase"
import PhotoUploadScreen from "@/screens/PhotoUploadScreen"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  PhotoUploadScreen: undefined
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const {
    theme: { colors },
  } = useAppTheme()
  const {
    authToken,
    setUser,
    setOAuthToken,
    setOAuthRefreshToken,
    logout,
    setAuthRefreshToken,
    setAuthToken,
    setAuthState,
    authRefreshToken,
    isAuthenticated,
  } = useAuthenticationStore()
  const { hasPreferences } = useAppStore()
  const setupSupaBase = async () => {
    await supabase.auth.onAuthStateChange((event, session) => {
      setAuthState(event)
      console.log({ event })
      console.log(JSON.stringify(session, null, 4))
      if (session?.refresh_token && session.access_token) {
        setAuthRefreshToken(session?.refresh_token)
        setAuthToken(session?.access_token)
      }
      if (session) {
        setUser(session.user)
      }
      if (session && session.provider_token) {
        setOAuthToken(session.provider_token)
      }

      if (session && session.provider_refresh_token) {
        setOAuthRefreshToken(session.provider_refresh_token)
      }

      if (event === "SIGNED_OUT") {
        logout()
      }
    })
    if (authToken && authRefreshToken) {
      await supabase.auth
        .setSession({
          access_token: authToken,
          refresh_token: authRefreshToken,
        })

    }
  }
  useEffect(() => {
    setupSupaBase()
  }, [])

  useEffect(() => {
    console.log({ hasPreferences })
  }, [hasPreferences])

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        navigationBarColor: colors.background,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : hasPreferences ? (
        <Stack.Screen name="PhotoUploadScreen" component={PhotoUploadScreen} />
      ) : (
        <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      )}
      {/** 🔥 Your screens go here */}
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export interface NavigationProps extends Partial<ComponentProps<typeof NavigationContainer>> { }

export const AppNavigator = (props: NavigationProps) => {
  const { themeScheme, navigationTheme, setThemeContextOverride, ThemeProvider } =
    useThemeProvider()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <ThemeProvider value={{ themeScheme, setThemeContextOverride }}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <AppStack />
      </NavigationContainer>
    </ThemeProvider>
  )
}
