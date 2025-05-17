import { Image, StyleSheet, Text, View } from "react-native"

import ContinueButton from "@/components/Login/ContinueButton"
import PhoneInput from "@/components/Login/PhoneInput"
import TermsText from "@/components/Login/TermsText"
import { useSession } from "@/ctx"
import { sendOtp } from "@/utils/sendotp"
import { router } from "expo-router"
import { useState } from "react"

export default function SignIn() {
  return <Login />
}
// 1191796852
const Login = () => {
  const { signIn } = useSession()
  const [phoneNumber, setPhoneNumber] = useState("")
  async function handelSendOtp() {
    let res = await sendOtp(phoneNumber)
    console.log("res", res)

    if (res?.status === 200) {
      router.push({
        pathname: "/otp-verify",
        params: { phoneNumber },
      })
    }

    // console.log("res", res)
  }
  return (
    <View style={styles.container}>
      {/* Background Image */}

      <Text
        onPress={() => {
          signIn()

          router.replace("/")
        }}
      >
        Sign In
      </Text>
      <Image
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/d1323209424d42209255fa5fb2f0a698/8de6ca0eb0a1dbbc46b5ded6814e5e179a0eacf9?placeholderIfAbsent=true",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Get your perfect{"\n"}style in minutes
          </Text>
          ``{" "}
        </View>

        <View style={styles.mainContent}>
          <PhoneInput
            setPhoneNumber={setPhoneNumber}
            phoneNumber={phoneNumber}
          />

          <ContinueButton onPress={handelSendOtp} />

          {/* Terms and Privacy Policy */}
          <TermsText />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 64,
    paddingBottom: 40,
  },
  header: {
    marginTop: 40,
  },
  headerText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  mainContent: {
    marginBottom: 20,
  },
})
