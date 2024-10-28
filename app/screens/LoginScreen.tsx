import { useEffect, useState } from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Button, Screen, Text } from "../components"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"
import { supabase } from "@/utils/supabase"
import * as Linking from "expo-linking"


export const LoginScreen = (_props) => {
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

      if (queryParams?.refresh_token && queryParams?.access_token)
        await supabase.auth.setSession({
          access_token: queryParams?.access_token as unknown as string,
          refresh_token: queryParams?.refresh_token as unknown as string,
        })
      console.log({ url })
    }
  }

  useEffect(() => {
    setupSupaBaseDeepLink()
  }, [url])

  const handleSpotifyLogin = async () => {
    return await supabase.auth
      .signInWithOAuth({
        provider: "spotify",
      })
      .then(({ data }) => {
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
