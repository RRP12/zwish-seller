import AsyncStorage from "@react-native-async-storage/async-storage";
import { SplashScreen, useRouter } from "expo-router";
import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { Text, View } from "react-native";

// Prevent the splash screen from auto-hiding
try {
  SplashScreen.preventAutoHideAsync();
} catch (e) {
  console.log("Error preventing splash screen from auto-hiding", e);
}

const authStorageKey = "auth-key";

export const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  isReady: false,
  logIn: () => {},
  logOut: () => {},
});

export function AuthProvider({ children }: PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  console.log("isLoggedIn", isLoggedIn);

  const storeAuthState = async (newState: { isLoggedIn: boolean }) => {
    try {
      const jsonValue = JSON.stringify(newState);
      await AsyncStorage.setItem(authStorageKey, jsonValue);
    } catch (error) {
      console.log("Error saving", error);
    }
  };

  const logIn = () => {
    setIsLoggedIn(true);
    storeAuthState({ isLoggedIn: true });
    // Use the correct route format for Expo Router 
  };

  const logOut = () => {
    setIsLoggedIn(false);
    storeAuthState({ isLoggedIn: false });
    router.replace("/login");
  };

  useEffect(() => {
    async function prepare() {
      try {
        // Always set to logged out for testing purposes
        await AsyncStorage.removeItem(authStorageKey);
        setIsLoggedIn(false);
      } catch (e) {
        console.warn("Failed to clear auth state", e);
      } finally {
        // Set ready state regardless of success/failure
        setIsReady(true);
        // Ensure splash screen is hidden
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.log("Error hiding splash screen", e);
        }
      }
    }
    
    prepare();
  }, []);

  // If not ready yet, show a simple loading screen
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        logIn,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}