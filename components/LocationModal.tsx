import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Modal,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onContinue?: () => void;
  onAddNewLocation?: () => void;
  onSelectAddress?: (address: string) => void;
  savedAddress?: string;
}

const { width, height } = Dimensions.get('window');

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onClose,
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
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              {/* Close Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
              
              {/* Title */}
              <ThemedText style={styles.title}>Location</ThemedText>
              
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
                onPress={() => {
                  onSelectAddress && onSelectAddress(savedAddress);
                  onClose();
                }}
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
                onPress={() => {
                  onAddNewLocation && onAddNewLocation();
                  onClose();
                }}
              >
                <Ionicons name="search-outline" size={20} color="black" />
                <Text style={styles.addLocationText}>Add new Location</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
    height: height * 0.7, // 70% of screen height
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  mapIconBackground: {
    width: 120,
    height: 120,
    backgroundColor: '#E8F7FF',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  continueButton: {
    backgroundColor: '#00C9FF', // Cyan blue from the app's theme
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    alignItems: 'center',
    marginBottom: 15,
  },
  dividerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectAddressText: {
    fontSize: 18,
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

export default LocationModal;
