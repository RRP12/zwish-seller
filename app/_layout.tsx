import { AuthProvider, useAuth } from "@/utils/authContext";
import { Stack, useRouter, SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

// Keep SplashScreen visible until we know the auth state
SplashScreen.preventAutoHideAsync();

function RootNavigationController() {
  const { isLoggedIn, isAuthLoading, isNewUser } = useAuth(); // Use isNewUser if needed for other root logic, or remove if not.
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      // Still loading auth state, SplashScreen is visible
      return;
    }

    SplashScreen.hideAsync(); // Hide splash screen now that we have auth state

    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      // User is logged in.
      // The verify-otp.tsx screen handles navigation to SellerOnboardingScreen or '/'
      // based on the API's is_new flag after a successful login.
      // If the app is re-opened and the user was already logged in (tokens in SecureStore),
      // initializeAuth in AuthContext sets isLoggedIn and isNewUser.
      // If isNewUser is true at this point, we might want to redirect to onboarding.
      // Otherwise, they stay on the current route (or default to main app area).
      if (isNewUser) {
        // This case handles if the app was closed mid-onboarding and reopened.
        // Or if a new user logs in, verify-otp navigates, but if they then background
        // and reopen, this ensures they are still on onboarding.
        router.replace("/SellerOnboardingScreen");
      } 
      // If !isNewUser, they should be on '/' or their last protected route.
      // No explicit router.replace('/') here, as that might be too aggressive
      // and override deep links or current navigation state within protected routes.
    }
  }, [isLoggedIn, isAuthLoading, isNewUser, router]);

  // This Stack is now conditional based on the logic above.
  // The router.replace calls will handle navigation.
  // We still need to define the screens for the router to know about them.
  return (
    <Stack>
      <Stack.Screen
        name="(protected)"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          animation: "none",
          title: "Login",
          headerShown: false
        }}
      />
      <Stack.Screen
        name="verify-otp"
        options={{
          animation: "slide_from_right",
          title: "OTP Verification",
          headerShown: false
        }}
      />
      {/* Add SellerOnboardingScreen to the root stack if it's not in a group */}
      <Stack.Screen
        name="SellerOnboardingScreen"
        options={{
          title: "Seller Onboarding",
          headerShown: false, // Or true if you want a header
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <RootNavigationController />
    </AuthProvider>
  );
}