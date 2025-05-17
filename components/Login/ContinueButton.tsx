import React from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"

const ContinueButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Continue"
      accessibilityHint="Tap to continue with your phone number"
    >
      <Text style={styles.buttonText}>Continue</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
})

export default ContinueButton
