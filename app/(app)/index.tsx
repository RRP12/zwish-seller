import { Text, View } from "react-native"

import { useSession } from "@/ctx"

import { fetchUserMe } from "@/utils/sendotp"
import React, { useEffect, useState } from "react"

export default function Index() {
  const { signOut, session } = useSession()

  console.log("session", session)

  const [userData, setuserData] = useState()

  useEffect(() => {
    async function getUserDetails() {
      let data = await fetchUserMe(
        "https://zwishh-gateway-ce7mtpkb.an.gateway.dev/",
        session
      )

      setuserData(data)
    }

    getUserDetails()
  }, [])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text
        onPress={() => {
          signOut()
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          // signOut()
        }}
      >
        Sign Out
      </Text>

      <Text>{JSON.stringify(userData)}</Text>
      {/* 
      <View>
        <CreateProfile userInfoToken={"userInfoToken"} jwtToken={session} />
      </View> */}
    </View>
  )
}
