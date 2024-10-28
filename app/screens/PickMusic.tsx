/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useRef } from "react"
import { Image, StyleSheet, View, type ImageSourcePropType } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { AntDesign } from "@expo/vector-icons"
import { Swiper, type SwiperCardRefType } from "rn-swiper-list"

const IMAGES = [
  "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c",
  "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c",
  "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c",
  "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c",
  "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c",
  "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c",
]

const PickMusic = () => {
  const ref = useRef<SwiperCardRefType>()

  const renderCard = useCallback((image) => {
    return (
      <View style={styles.renderCardContainer}>
        <Image
          source={{ uri: "https://i.scdn.co/image/ab67616d0000b273442b53773d50e1b5369bb16c" }}
          style={styles.renderCardImage}
          resizeMode="cover"
        />
      </View>
    )
  }, [])
  const OverlayLabelRight = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: "green",
          },
        ]}
      />
    )
  }, [])
  const OverlayLabelLeft = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: "red",
          },
        ]}
      />
    )
  }, [])
  const OverlayLabelTop = useCallback(() => {
    return (
      <View
        style={[
          styles.overlayLabelContainer,
          {
            backgroundColor: "blue",
          },
        ]}
      />
    )
  }, [])

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.subContainer}>
        <Swiper
          ref={ref}
          cardStyle={styles.cardStyle}
          data={IMAGES}
          renderCard={renderCard}
          onIndexChange={(index) => {
            console.log("Current Active index", index)
          }}
          onSwipeRight={(cardIndex) => {
            console.log("cardIndex", cardIndex)
          }}
          onSwipedAll={() => {
            console.log("onSwipedAll")
          }}
          onSwipeLeft={(cardIndex) => {
            console.log("onSwipeLeft", cardIndex)
          }}
          onSwipeTop={(cardIndex) => {
            console.log("onSwipeTop", cardIndex)
          }}
          OverlayLabelRight={OverlayLabelRight}
          OverlayLabelLeft={OverlayLabelLeft}
          OverlayLabelTop={OverlayLabelTop}
          onSwipeActive={() => {
            console.log("onSwipeActive")
          }}
          onSwipeStart={() => {
            console.log("onSwipeStart")
          }}
          onSwipeEnd={() => {
            console.log("onSwipeEnd")
          }}
        />
      </View>
    </GestureHandlerRootView>
  )
}

export default PickMusic

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    aspectRatio: 1,
    backgroundColor: "#3A3D45",
    borderRadius: 40,
    elevation: 4,
    height: 80,
    justifyContent: "center",
    marginHorizontal: 20,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonsContainer: {
    alignItems: "center",
    bottom: 34,
    flexDirection: "row",
    justifyContent: "center",
  },
  cardStyle: {
    borderRadius: 15,
    height: "75%",
    marginVertical: 20,
    width: "95%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  overlayLabelContainer: {
    borderRadius: 15,
    height: "100%",
    width: "100%",
  },
  renderCardContainer: {
    borderRadius: 15,
    flex: 1,
    height: "75%",
    width: "100%",
  },
  renderCardImage: {
    borderRadius: 15,
    height: "100%",
    width: "100%",
  },
  subContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
})
