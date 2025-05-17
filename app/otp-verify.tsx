import { useSessionContext } from "@/ctx"
import { verifyOtp } from "@/utils/sendotp"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native"
import { OtpInput } from "react-native-otp-entry"

export default function App() {
  let router = useRouter()
  let { signIn } = useSessionContext()
  const [otp, setotp] = useState()
  const params = useLocalSearchParams()
  useEffect(() => {
    console.log("phoneNumber", params.phoneNumber)
  }, [])
  async function handelVerifyOtp() {
    console.log("phoneNumber", params)
    try {
      let data = await verifyOtp(params?.phoneNumber, otp)
      console.log("OTP verification response:", data)
      let { access_token } = data || {}

      if (access_token) {
        console.log("Access token received, signing in...")
        await signIn(access_token)
        console.log("Signed in, navigating to home")
        router.push("/(app)/home")
      } else {
        console.log("No access token in response")
      }
    } catch (error) {
      console.error("Error in OTP verification:", error)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <OtpInput onTextChange={(text) => setotp(text)} />

        <Pressable onPress={handelVerifyOtp}>
          <Text>Verify Otp</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  wrapper: {
    paddingHorizontal: 16,
  },
})
