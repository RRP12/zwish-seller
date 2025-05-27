import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

type TabIconType = {
  name: string;
  icon: string;
  route: string;
  fontAwesome?: boolean;
  feather?: boolean;
};

export default function TabBar() {
  const router = useRouter();
  const pathname = usePathname();

  // Define the tabs based on the Figma design
  const tabs: TabIconType[] = [
    { name: 'Home', icon: 'home-outline', route: '/(app)' },
    { name: 'Categories', icon: 'grid-outline', route: '/(app)/categories' },
    { name: 'Feeds', icon: 'camera-outline', route: '/(app)/feeds' },
    { name: 'Try-on', icon: 'user-alt', route: '/(app)/try-on', fontAwesome: true },
    { name: 'Cart', icon: 'shopping-cart', route: '/(app)/cart', feather: true },
  ];

  // Check if the current route is one of our main tab routes
  const isTabRoute = tabs.some(tab => 
    pathname === tab.route || 
    pathname === tab.route + '/index' || 
    (pathname === '/(app)/index' && tab.route === '/(app)')
  );
  
  // Don't show the tab bar on non-tab routes like profile or video-reels
  if (!isTabRoute && pathname !== '/(app)/index') {
    return null;
  }

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isActive = 
          pathname === tab.route || 
          pathname === tab.route + '/index' || 
          (tab.route === '/(app)' && pathname === '/(app)/index');

        const color = isActive ? '#00C9FF' : '#888';

        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => {
              // Cast the route to any to avoid TypeScript errors
              // This is safe because we're using predefined routes
              router.navigate(tab.route as any);
            }}
          >
            {tab.fontAwesome ? (
              <FontAwesome5 name={'user-alt'} size={24} color={color} />
            ) : tab.feather ? (
              <Feather name={'shopping-cart'} size={24} color={color} />
            ) : (
              <Ionicons name={tab.icon as any} size={24} color={color} />
            )}
            <Text style={[styles.tabText, { color }]}>{tab.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: '#333',
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
});
