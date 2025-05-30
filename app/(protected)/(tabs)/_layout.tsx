import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Slot, router, useSegments, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomNavItem from '../../../components/dashboard/BottomNavItem'; // Adjusted path

const BOTTOM_NAV_HEIGHT = 73;

interface NavItem {
  name: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  path: string; // Path relative to the (tabs) layout
  label: string;
}

const TabsLayout = () => {
  const insets = useSafeAreaInsets();
  const segments = useSegments(); 
  const pathname = usePathname();
  const [activeTabName, setActiveTabName] = useState('Dashboard');

  const bottomNavItems: NavItem[] = [
    { name: 'Dashboard', icon: 'view-dashboard-outline', path: 'index', label: 'Dashboard' },
    { name: 'Orders', icon: 'cube-outline', path: 'orders', label: 'Orders' }, 
    { name: 'Profile', icon: 'account-circle-outline', path: 'profile', label: 'Profile' },
  ];

    useEffect(() => {
    let currentScreenName = 'index'; // Default to index
    const relevantPathParts = pathname.split('/').filter(p => p && p !== '(protected)' && p !== '(tabs)');
    const screenCandidate = relevantPathParts[relevantPathParts.length - 1];

    if (pathname === '/(protected)/(tabs)' || pathname === '/(protected)/(tabs)/') {
      currentScreenName = 'index';
    } else if (screenCandidate) {
      currentScreenName = screenCandidate.split('?')[0]; // Remove query params for matching
    }

    const currentActiveTab = bottomNavItems.find(item => item.path === currentScreenName);
    if (currentActiveTab) {
      setActiveTabName(currentActiveTab.name);
    } else {
      // If no direct match (e.g. path is just '/(protected)/(tabs)'), default to index's tab name
      const indexTab = bottomNavItems.find(item => item.path === 'index');
      setActiveTabName(indexTab ? indexTab.name : 'Dashboard'); // Fallback to 'Dashboard'
    }
  }, [pathname, bottomNavItems]);

  const handleBottomNavPress = (tabPath: string) => {
    // Expo Router's Href type can be complex. Casting to `any` for `router.push`
    // is a common workaround if string paths are known to be valid.
    let targetPath: string;
    if (tabPath === 'index') {
      targetPath = '/(protected)/(tabs)/';
    } else {
      targetPath = `/(protected)/(tabs)/${tabPath}`;
    }
    router.push(targetPath as any);
  };

  return (
    <View style={styles.layoutContainer}>
      <View style={{flex: 1}}>
        <Slot /> {/* Child screen content will be rendered here */}
      </View>
      {/* Bottom Navigation Bar */}
      <View 
        style={[
          styles.bottomNavContainer, 
          { 
            height: BOTTOM_NAV_HEIGHT + insets.bottom, 
            paddingBottom: insets.bottom 
          }
        ]}
      >
        {bottomNavItems.map((item) => (
          <BottomNavItem
            key={item.name}
            iconName={item.icon}
            label={item.label}
            isActive={activeTabName === item.name}
            onPress={() => handleBottomNavPress(item.path)}
            activeColor="#00C9FF"
            inactiveColor="#FFFFFF"
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10, 
    backgroundColor: '#000000', 
    borderTopWidth: 2, 
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    width: '100%', 
  },
});

export default TabsLayout;
