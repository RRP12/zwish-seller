import React from "react"
import { Linking, StyleSheet, Text, View } from "react-native"

const TermsText = () => {
  const openTerms = () => {
    Linking.openURL("https://example.com/terms")
  }

  const openPrivacy = () => {
    Linking.openURL("https://example.com/privacy")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By continuing, you agree to our{"\n"}
        <Text style={styles.link} onPress={openTerms} accessibilityRole="link">
          Terms of Use
        </Text>{" "}
        &{" "}
        <Text
          style={styles.link}
          onPress={openPrivacy}
          accessibilityRole="link"
        >
          Privacy Policy
        </Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 16,
  },
  text: {
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    fontSize: 14,
  },
  link: {
    color: "white",
  },
})

export default TermsText
