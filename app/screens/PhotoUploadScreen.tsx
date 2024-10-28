import React, { useState } from "react"
import { View, Image, StyleSheet, Platform } from "react-native"
import { Button, Text, useTheme, ActivityIndicator, Snackbar } from "react-native-paper"
import * as ImagePicker from "expo-image-picker"
import * as Location from "expo-location"
import { useAuthenticationStore } from "@/store/RootStore"
import { supabase } from "@/utils/supabase"
import axios from "axios"
export type GeoPosition = {
  latitude: number
  longitude: number
}
const PhotoUploadScreen = () => {
  const theme = useTheme()
  const [imageUri, setImageUri] = useState(null)
  const [location, setLocation] = useState<GeoPosition | null>(null)
  const [loading, setLoading] = useState(false)
  const [snackbarVisible, setSnackbarVisible] = useState(false)

  const authStore = useAuthenticationStore()
  const userId = authStore.user?.id
  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!")
      return
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })

    if (!result.canceled) {
      setImageUri(result.uri)
    }
  }

  // Function to capture the location
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== "granted") {
      alert("Permission to access location was denied")
      return
    }

    const locationData = await Location.getCurrentPositionAsync({})
    setLocation({
      latitude: locationData.coords.latitude,
      longitude: locationData.coords.longitude,
    })
  }

  // Function to upload photo to Supabase
  const uploadPhoto = async () => {
    if (!imageUri || !location) {
      alert("Please select an image and allow location access.")
      return
    }

    setLoading(true)
    try {
      const timestamp = new Date().toISOString()
      const response = await fetch(imageUri)
      const blob = await response.blob()

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(`photos/${userId}_${timestamp}.jpg`, blob, {
          contentType: "image/jpeg",
        })

      if (error) throw error

      // Save metadata to Supabase database
      await supabase.from("photos").insert({
        user_id: userId,
        image_url: data.path,
        timestamp,
        location,
      })

      setSnackbarVisible(true)
      setImageUri(null)
      setLocation(null)
    } catch (error) {
      console.error("Upload failed:", error.message)
      alert("Failed to upload photo")
    } finally {
      setLoading(false)
    }
  }
  const { oauthToken, logout } = useAuthenticationStore()
  const fakeIt = async () => {
    const { data: songsData } = await axios.get(
      "https://kaifqnazdtdjcoiwgxgq.supabase.co/functions/v1/spotifind",
      {
        headers: {
          Authorization: `Bearer ${authStore.authToken}`,
        },
      },
    )

    console.log(JSON.stringify(songsData, null, 4))
    await Promise.all(
      songsData.data.map(async (item) => {
        await axios
          .get("https://api.spotify.com/v1/search?q=artist:" +
            encodeURI(
              `${item.artist}&track:${item.song}&type=track`,
            ),
            {
              headers: {
                Authorization: `Bearer ${oauthToken}`,
              },
            },
          )
          .then(({ data }) => {
            console.log(data, "+++++++++++++++++")
            const mapTrackData = (trackData) => {
              const track = trackData.tracks.items[0] // Access the first track
              return {
                name: track.name,
                image: track.album.images[0].url, // Choose the first image URL
                artist: track.artists.map((artist) => artist.name).join(", "), // Join multiple artists' names
                spotifyLink: track.external_urls.spotify,
                trackId: track.id,
              }
            }

            const mappedData = mapTrackData(data)
            console.log(mappedData)
          })
          .catch((error) => {
            console.log(JSON.stringify(error, null, 4))
          })
      }),
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.title}>Capture and Upload Photo</Text>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}

      <Button mode="contained" icon="camera" onPress={pickImage} style={styles.button}>
        Take a Photo
      </Button>

      <Button mode="outlined" icon="map-marker" onPress={getLocation} style={styles.button}>
        Get Location
      </Button>

      <Text style={styles.infoText}>
        {location
          ? `Location: ${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
          : "Location not captured yet"}
      </Text>

      <Button
        mode="contained"
        icon="upload"
        onPress={fakeIt}
        // onPress={uploadPhoto}
        loading={loading}
        style={styles.uploadButton}
      // disabled={!imageUri || !location || loading}
      >
        Upload Photo
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Photo uploaded successfully!
      </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  imagePreview: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    height: 300,
    marginBottom: 20,
    width: "100%",
  },
  infoText: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  uploadButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
})

export default PhotoUploadScreen
