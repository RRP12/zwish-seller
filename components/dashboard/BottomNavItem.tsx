// /Users/rushikeshpatil/zwish-seller/components/dashboard/BottomNavItem.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface BottomNavItemProps {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name']; // Type for MaterialCommunityIcons name
  label: string;
  isActive?: boolean;
  onPress: () => void;
  activeColor?: string;
  inactiveColor?: string;
  iconSize?: number;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({
  iconName,
  label,
  isActive = false,
  onPress,
  activeColor = '#00C9FF', // Figma active color
  inactiveColor = '#FFFFFF', // Figma inactive color
  iconSize = 24, // Default icon size
}) => {
  const color = isActive ? activeColor : inactiveColor;

  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />
      <Text style={[styles.navItemLabel, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navItem: {
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    flex: 1, // Distribute space equally among items
    paddingVertical: 8, // Padding for touch area and visual balance
  },
  navItemLabel: {
    fontFamily: 'Basic', // TODO: Ensure 'Basic' font is loaded
    fontSize: 12, // Figma: 12px
    lineHeight: 15, // Figma: 15px
    marginTop: 4, // Space between icon and label
  },
});

export default BottomNavItem;
