import { Redirect } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  // Instead of trying to render a tab layout, just redirect to the app index
  return <Redirect href="/(app)" />;
  
  // Alternative approach if you want to keep the tabs pages accessible:
  // return (
  //   <Stack screenOptions={{ headerShown: false }}>
  //     <Stack.Screen name="index" />
  //     <Stack.Screen name="explore" />
  //   </Stack>
  // );
}
