import React, { useState } from "react"
import { Alert, Button, StyleSheet, TextInput, View } from "react-native"

const CreateProfile = ({ userInfoToken, jwtToken }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    profile_picture: "",
    addresses: [],
  })

  const handleChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/user/v1/me",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Apigateway-Api-Userinfo": userInfoToken,
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Unknown error")
      }

      const data = await response.json()
      Alert.alert("Success", "Profile created successfully")
      console.log("Profile created:", data)
    } catch (error) {
      Alert.alert("Error", error.message)
      console.error("Failed to create profile:", error)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={formData.first_name}
        onChangeText={(text) => handleChange("first_name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={formData.last_name}
        onChangeText={(text) => handleChange("last_name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={formData.phone_number}
        onChangeText={(text) => handleChange("phone_number", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={formData.date_of_birth}
        onChangeText={(text) => handleChange("date_of_birth", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.gender}
        onChangeText={(text) => handleChange("gender", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Profile Picture URL"
        value={formData.profile_picture}
        onChangeText={(text) => handleChange("profile_picture", text)}
      />
      <Button title="Create Profile" onPress={handleSubmit} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
})

export default CreateProfile
