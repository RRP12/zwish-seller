import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface LocationProps {
  onContinue?: () => void;
  onAddNewLocation?: () => void;
  onSelectAddress?: (address: string) => void;
  savedAddress?: string;
}

const Location: React.FC<LocationProps> = ({
  onContinue,
  onAddNewLocation,
  onSelectAddress,
  savedAddress = 'Home - 156, 15th Flr, Maker Chambers...',
}) => {
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // This would be replaced with actual location permission logic
  const requestLocationPermission = async () => {
    // Simulating permission request
    setLocationPermission(true);
    onContinue && onContinue();
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Zwishh</Text>
        <Text style={styles.subtitle}>Get your perfect</Text>
        <Text style={styles.subtitle}>style in minutes</Text>
      </View>

      {/* Map Icon */}
      <View style={styles.mapContainer}>
        <View style={styles.mapIconBackground}>
          <Ionicons name="map-outline" size={70} color="#00C9FF" />
        </View>
      </View>

      {/* Location Text */}
      <ThemedText style={styles.locationText}>Turn on your location</ThemedText>

      {/* Continue Button */}
      <TouchableOpacity 
        style={styles.continueButton} 
        onPress={requestLocationPermission}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Or Divider */}
      <View style={styles.divider}>
        <Text style={styles.dividerText}>Or</Text>
      </View>

      {/* Select Address Text */}
      <ThemedText style={styles.selectAddressText}>Select your address</ThemedText>

      {/* Saved Address */}
      <TouchableOpacity 
        style={styles.savedAddressContainer}
        onPress={() => onSelectAddress && onSelectAddress(savedAddress)}
      >
        <Ionicons name="home-outline" size={24} color="black" style={styles.homeIcon} />
        <View style={styles.addressTextContainer}>
          <ThemedText style={styles.addressLabel}>Home</ThemedText>
          <ThemedText style={styles.addressText} numberOfLines={1}>{savedAddress}</ThemedText>
        </View>
      </TouchableOpacity>

      {/* Add New Location Button */}
      <TouchableOpacity 
        style={styles.addLocationButton}
        onPress={onAddNewLocation}
      >
        <Ionicons name="search-outline" size={20} color="black" />
        <Text style={styles.addLocationText}>Add new Location</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00C9FF', // Cyan blue background from Figma
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  mapIconBackground: {
    width: 150,
    height: 150,
    backgroundColor: '#8FD3E0',
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#8FD3E0', // Light blue from Figma
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectAddressText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  savedAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  homeIcon: {
    marginRight: 10,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  addLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
  },
  addLocationText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Location;
