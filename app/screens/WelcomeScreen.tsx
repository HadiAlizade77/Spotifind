import { useEffect, useState } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { Chip, Text, Button, useTheme } from "react-native-paper"
import { supabase } from "@/utils/supabase"

export const WelcomeScreen = () => {
  const getUser = async () => {
    const user = await supabase.auth.getUser()
    // Fetch user data
    console.log(user)
  }
  useEffect(() => {
    getUser()
  }, [])


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
  const userId = 1
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
    const { data, error } = await supabase.from("preferences").upsert({
      user_id: userId,
      genres: selectedGenres,
      languages: selectedLanguages,
    })
    if (error) console.error("Error saving preferences:", error)
    else alert("Preferences saved successfully!")
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
            textStyle={[
              styles.chipText,
              selectedGenres.includes(genre) && styles.chipTextSelected,
            ]}
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
