import { useAuth } from "@/utils/authContext";
import { Button, SafeAreaView, Text } from "react-native";


export default function SomeComponent() {
  const { isLoggedIn, logOut } = useAuth();

  return (
    <SafeAreaView>

      <Text>

        thisis the home screen
      </Text>
      {isLoggedIn ? (
        <Button title="Log Out" onPress={logOut} />
      ) : (
        <Text>Please log in</Text>
      )}
    </SafeAreaView>
  );
};
