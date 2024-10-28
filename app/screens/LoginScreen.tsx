import { useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { supabase } from "@/utils/supabase"
import * as Linking from "expo-linking"
import { authenticationStoreSelector } from "@/store/AuthenticationStore"
import { useAuthenticationStore } from "@/store/RootStore"

export const LoginScreen = () => {
  const authStore = useAuthenticationStore()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  const url = Linking.useURL()

  const setupSupaBaseDeepLink = async () => {
    if (url) {
      const fixQP = url.replace("signin#access_token", "signin?access_token")
      const { queryParams } = Linking.parse(fixQP)
      console.log({ queryParams })
      await supabase.auth.exchangeCodeForSession(queryParams?.code as string)

    }
  }
  const scopes = [
    "playlist-read-collaborative",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-email",
    "user-read-private",
    "user-read-playback-position",
    "user-top-read",
  ]

  useEffect(() => {
    setupSupaBaseDeepLink()
  }, [url])
  const handleSpotifyLogin = async () => {
    return await supabase.auth
      .signInWithOAuth({
        provider: "spotify",
        options: {
          redirectTo: "https://kaifqnazdtdjcoiwgxgq.supabase.co/functions/v1/spotify-login",
          scopes: scopes.join(" "),
          skipBrowserRedirect: true,
        },
      })
      .then(({ data, ...rest }) => {
        // eslint-disable-next-line camelcase
        const code_challenge = new URL(data.url!).searchParams.get("code_challenge");
        // eslint-disable-next-line camelcase
        console.log({ code_challenge })

        console.log(rest)
        console.log(data.url)
        data?.url && Linking.openURL(data.url)
      })
  }

  async function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    await handleSpotifyLogin()
    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={themed($screenContentContainer)}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen:login" preset="heading" style={themed($logIn)} />

      <Button
        testID="login-button"
        tx="loginScreen:spotifyLogin"
        style={themed($tapButton)}
        preset="reversed"
        onPress={login}
      />
    </Screen>
  )
}

const $screenContentContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
})

const $logIn: ThemedStyle<TextStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})

const $tapButton: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginTop: spacing.xs,
})
