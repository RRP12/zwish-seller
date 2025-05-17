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
    let data = await verifyOtp(params?.phoneNumber, otp)
    let { access_token } = data

    if (access_token) {
      signIn(access_token)
      router.push("/")
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
