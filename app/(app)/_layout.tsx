import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Tabs } from "expo-router"
import { Text } from "react-native"

import { useSession } from "../../ctx"

export default function AppLayout() {
  const { session, isLoading } = useSession()

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the sign-in flow and onboarding
  if (!session) {
    // For React Native, we can't access window.location
    // Instead, we'll handle the redirection in the root layout
    return <Tabs />
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111',
          borderTopWidth: 1,
          borderTopColor: '#333',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60
        },
        tabBarActiveTintColor: '#00C9FF',
        tabBarInactiveTintColor: '#888',
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 0,
          marginBottom: 5
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="feeds"
        options={{
          title: 'Feeds',
          tabBarIcon: ({ color, size }) => (
            <Feather name="grid" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="try-on"
        options={{
          title: 'Try-on',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="try" size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Feather name="shopping-cart" size={size} color={color} />
          )
        }}
      />
    </Tabs>
  )
}
