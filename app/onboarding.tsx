import type { LocationObject } from 'expo-location';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { useSession } from "@/ctx";
import AddressDetails from "@/components/ui/AddressDetils";
import CreateProfile from "@/components/UserProfile";
import { fetchUserMe } from "@/utils/sendotp";
import React, { useEffect, useState } from "react";

export default function Onboarding() {
  const { session, isLoading } = useSession()
  const router = useRouter()
 
  console.log("Onboarding screen loaded with session:", session)

  const [userData, setUserData] = useState<any>(null)
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    console.log("Onboarding useEffect triggered")
    async function getUserDetails() {
      try {
        console.log("Fetching user details with session:", session)
        let data = await fetchUserMe(
          "https://zwishh-gateway-ce7mtpkb.an.gateway.dev/",
          session
        )
        console.log("User details received:", data)
        setUserData(data)
      } catch (error: any) {
        console.error("Error fetching user details:", error)
        setErrorMsg("Failed to load user data")
      } finally {
        setIsLoadingData(false)
      }
    }

    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log("Location permission status:", status)
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log("Location received:", location)
        setLocation(location);
      } catch (err) {
        console.error("Error getting location:", err)
        setErrorMsg('Failed to get location');
      }
    })();

    if (session) {
      getUserDetails()
    }

  }, [session])

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={styles.titleText}
        >
          Onboarding
        </Text>

        <Text
          style={styles.signOutText}
          onPress={() => {
            console.log("Navigate to sign-in");
            router.replace('/sign-in');
          }}
        >
          Cancel
        </Text>

        <View style={styles.profileContainer}>
          <CreateProfile session={session} />
          <AddressDetails/>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signOutText: {
    marginBottom: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  userDataText: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    width: '100%',
  },
  profileContainer: {
    width: '100%',
    marginTop: 10,
  },
});