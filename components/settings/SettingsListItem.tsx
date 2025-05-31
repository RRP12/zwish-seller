import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Or any other icon library you prefer

interface SettingsListItemProps {
  iconName: React.ComponentProps<typeof Ionicons>['name']; // Adjust based on icon library
  label: string;
  onPress: () => void;
  iconColor?: string;
  textColor?: string;
  arrowColor?: string;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({
  iconName,
  label,
  onPress,
  iconColor = '#FFFFFF',
  textColor = '#FFFFFF',
  arrowColor = '#00C9FF',
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward-outline" size={22} color={arrowColor} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18, 
  },
  iconContainer: {
    width: 30, 
    alignItems: 'center', 
    marginRight: 15, 
  },
  label: {
    flex: 1, 
    fontFamily: 'Basic', 
    fontSize: 24, 
    lineHeight: 30, 
  },
  arrowContainer: {
    marginLeft: 10, 
  },
});

export default SettingsListItem;
