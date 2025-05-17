import { useSession } from "@/ctx"
import { createAddress } from "@/utils/sendotp"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native"

interface AddressDetailsProps {}

const AddressDetails: React.FC<AddressDetailsProps> = () => {
  const [addressType, setAddressType] = useState("home")
  const [streetAddress, setStreetAddress] = useState("123 testing st")
  const [city, setCity] = useState("test city")
  const [state, setState] = useState("test state")
  const [postalCode, setPostalCode] = useState("12345")
  const [country, setCountry] = useState("usa")
  const [latitude, setLatitude] = useState("37.7749")
  const [longitude, setLongitude] = useState("-122.4194")
  const [isDefault, setIsDefault] = useState(false)
  const { session } = useSession()

  const router = useRouter()
  const handleSubmit = () => {
    if (
      addressType &&
      streetAddress &&
      city &&
      state &&
      postalCode &&
      country &&
      latitude &&
      longitude
    ) {
      createAddress({
        address_type: addressType,
        street_address: streetAddress,
        city,
        state,
        postal_code: postalCode,
        country,
        latitude,
        longitude,
        is_default: isDefault,
      },session)
      setAddressType("")
      setStreetAddress("")
      setCity("")
      setState("")
      setPostalCode("")
      setCountry("")
      setLatitude("")
      setLongitude("")
      setIsDefault(false)
      Keyboard.dismiss()
    }

    router.push("/")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Address Type</Text>
      <TextInput
        style={styles.input}
        value={addressType}
        onChangeText={setAddressType}
        placeholder="Address Type"
      />
      <Text style={styles.label}>Street Address</Text>
      <TextInput
        style={styles.input}
        value={streetAddress}
        onChangeText={setStreetAddress}
        placeholder="Street Address"
      />
      <Text style={styles.label}>City</Text>
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="City"
      />
      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        value={state}
        onChangeText={setState}
        placeholder="State"
      />
      <Text style={styles.label}>Postal Code</Text>
      <TextInput
        style={styles.input}
        value={postalCode}
        onChangeText={setPostalCode}
        placeholder="Postal Code"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Country</Text>
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
        placeholder="Country"
      />
      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        value={latitude}
        onChangeText={setLatitude}
        placeholder="Latitude"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        value={longitude}
        onChangeText={setLongitude}
        placeholder="Longitude"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Is Default?</Text>
      <TextInput
        style={styles.input}
        value={isDefault ? "true" : "false"}
        onChangeText={(value) => setIsDefault(value === "true")}
        placeholder="Is Default?"
      />
      <Text style={styles.button} onPress={handleSubmit}>
        Create Address
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#4f83cc",
    padding: 10,
    borderRadius: 5,
    color: "white",
    textAlign: "center",
  },
})

export default AddressDetails
