import { useEffect, useState } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Chip, Text, Button, useTheme } from "react-native-paper"
import { supabase } from "@/utils/supabase"
import { useAppStore, useAuthenticationStore } from "@/store/RootStore"

export const WelcomeScreen = () => {
  const authStore = useAuthenticationStore()
  const appStore = useAppStore()

  // List of music genres
  const musicGenres = [
    "Rock",
    "Pop",
    "Hip Hop",
    "Jazz",
    "Classical",
    "Electronic",
    "Reggae",
    "Country",
    "Blues",
    "R&B",
    "Soul",
    "Funk",
    "Metal",
    "Punk",
    "Gospel",
    "Latin",
    "K-Pop",
    "EDM",
    "Folk",
    "Disco",
  ]

  // Generate languages dynamically
  const languages = ["English", "Spanish", "French", "Japanese", "German", "Italian"].sort()
  const theme = useTheme()
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedLanguages, setSelectedLanguages] = useState([])

  // Toggle selection for genres
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    )
  }

  // Toggle selection for languages
  const toggleLanguage = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language],
    )
  }

  // Save preferences to Supabase
  const savePreferences = async () => {
    console.log(JSON.stringify(authStore.user, null, 2))
    await supabase
      .from("profile_preferences")
      .upsert({
        profile_id: authStore.user?.id,
        genres: selectedGenres,
        languages: selectedLanguages,
      })
      .then(async ({ data, error }) => {
        if (error) {
          console.log(error, "error in savePreferences")
        }
        console.log(data)
        await appStore.setHasPreferences(true)
        return data
      })
      .then(() => {
        alert("Preferences saved successfully!")
      })
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={styles.title}>Select Your Music Preferences</Text>

      <Text style={styles.subTitle}>Genres</Text>
      <View style={styles.chipContainer}>
        {musicGenres.map((genre) => (
          <Chip
            key={genre}
            style={[styles.chip, selectedGenres.includes(genre) && styles.chipSelected]}
            textStyle={[styles.chipText, selectedGenres.includes(genre) && styles.chipTextSelected]}
            onPress={() => toggleGenre(genre)}
          >
            {genre}
          </Chip>
        ))}
      </View>

      <Text style={styles.subTitle}>Languages</Text>
      <View style={styles.chipContainer}>
        {languages.map((language) => (
          <Chip
            key={language}
            style={[styles.chip, selectedLanguages.includes(language) && styles.chipSelected]}
            textStyle={[
              styles.chipText,
              selectedLanguages.includes(language) && styles.chipTextSelected,
            ]}
            onPress={() => toggleLanguage(language)}
          >
            {language}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={savePreferences}
        style={styles.saveButton}
        labelStyle={styles.saveButtonLabel}
      >
        Save Preferences
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#f0f0f0",
    borderColor: "#6200ee",
    margin: 5,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipSelected: {
    backgroundColor: "#6200ee",
  },
  chipText: {
    color: "#6200ee",
  },
  chipTextSelected: {
    color: "#fff",
  },
  container: {
    padding: 20,
  },
  saveButton: {
    marginTop: 30,
    paddingVertical: 10,
  },
  saveButtonLabel: {
    fontSize: 18,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
})
