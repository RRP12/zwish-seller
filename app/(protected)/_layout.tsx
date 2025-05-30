import { AuthContext } from "@/utils/authContext";
import { Redirect, Stack } from "expo-router";
import { useContext } from "react";


export default function ProtectedLayout() {


    const authState = useContext(AuthContext);
    if (!authState.isLoggedIn) {
        return <Redirect href="/login" />
    }
  return (
    <Stack screenOptions={{ headerShown: false }}>
     
      <Stack.Screen
        name="modal"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
        name="modal-with-stack"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      /> */}
    </Stack>
  );
}