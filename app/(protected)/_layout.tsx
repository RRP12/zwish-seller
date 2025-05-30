import { useAuth } from "@/utils/authContext";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
    const authState = useAuth();

  // Add debugging for authentication state
  useEffect(() => {
    console.log('Protected layout auth state:', {
      isAuthLoading: authState.isAuthLoading, // Added for complete debug info
      isLoggedIn: authState.isLoggedIn,
      hasAccessToken: !!authState.accessToken,
      hasRefreshToken: !!authState.refreshToken
    });
  }, [authState.isAuthLoading, authState.isLoggedIn, authState.accessToken, authState.refreshToken]);

  if (authState.isAuthLoading) {
    return null; // Wait for auth state to finish loading
  }

  if (!authState.isLoggedIn) {
    console.log('User not logged in, redirecting to login');
    return <Redirect href="/login" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" /> {/* Ensure this matches your directory structure */}
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          // headerShown: false, // Modals often have headers, adjust if needed
        }}
      />
      {/* Add other screens like modal-with-stack if they are part of this layout 
      <Stack.Screen
        name="modal-with-stack"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      /> */}
    </Stack>
  );
}