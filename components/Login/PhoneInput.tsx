import React from "react"
import { StyleSheet, Text, TextInput, View } from "react-native"

const PhoneInput = ({ setPhoneNumber, phoneNumber }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.countryCode}>
        <Text style={styles.countryCodeText}>+91</Text>
      </View>

      {/* Phone Number Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        placeholderTextColor="rgba(255, 255, 255, 0.6)"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        maxLength={10}
        accessibilityLabel="Phone number input"
        accessibilityHint="Enter your phone number to continue"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 24,
  },
  countryCode: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  countryCodeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    color: "white",
    fontSize: 16,
  },
})

export default PhoneInput
