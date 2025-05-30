import { AuthProvider } from "@/utils/authContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="auto" />
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
      </Stack>
    </AuthProvider>
  );
}