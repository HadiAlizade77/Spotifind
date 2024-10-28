import { Text } from "@/components"
import { supabase } from "@/utils/supabase"
import { useEffect } from "react"

export const WelcomeScreen = () => {
  const getUser = async () => {
    const user = await supabase.auth.getUser()
    // Fetch user data
    console.log(user)
  }
  useEffect(() => {
    getUser()
  }, [])
  return <Text testID="welcome-heading" tx="welcomeScreen:readyForLaunch" preset="heading" />
}
