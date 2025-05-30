import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createShop, ShopData } from '../utils/api'; // Import createShop and ShopData

const ShopDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ sellerId?: string }>();
  const sellerIdParam = params.sellerId;
  console.log('Received sellerIdParam in ShopDetailsScreen:', sellerIdParam);

  const [name, setName] = useState('Demo Shop');
  const [category, setCategory] = useState<'Clothing' | 'Footwear'>('Clothing'); // API expects 'Clothing' or 'Footwear'
  const [streetAddress, setStreetAddress] = useState('123 Demo Street');
  const [addressLine2, setAddressLine2] = useState('Demo Area'); // For the second address line from Figma
  const [addressLine3, setAddressLine3] = useState('Near Demo Landmark'); // For the third address line from Figma
  const [city, setCity] = useState('Demo City');
  const [state, setStateValue] = useState('Demo State'); // Renamed to avoid conflict with React's State type
  const [pincode, setPincode] = useState('123456');
  const [country, setCountry] = useState('India'); // Demo data has 'string', defaulting to India
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');
  // is_flagship, profile_picture, is_active, is_open will use API defaults or be added later

  const handleSaveShopDetails = async () => {
    if (!sellerIdParam) {
      Alert.alert('Error', 'Seller ID is missing.');
      return;
    }
    if (!name || !category || !streetAddress || !city || !state || !pincode || !latitude || !longitude) {
        Alert.alert('Error', 'Please fill all required fields.');
        return;
    }

    const shopData: ShopData = {
      name,
      category,
      street_address: streetAddress, // Consider concatenating addressLine2 and addressLine3 if needed by API
      city,
      state,
      pincode,
      country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      seller_id: parseInt(sellerIdParam, 10),
      is_flagship: true, // From demo data
      profile_picture: null, // Test with null instead of placeholder string
      is_active: true, // From demo data
      is_open: true, // From demo data
    };

    try {
      console.log('ShopData being sent from handleSaveShopDetails:', JSON.stringify(shopData, null, 2));
      const response = await createShop(shopData);

      console.log("response", response); 
      Alert.alert('Success', 'Shop details saved successfully!');
      // Navigate to the next screen or dashboard, e.g., back to a home or shop list
      router.replace('/'); // Navigate to Home Screen (Update to /SellerDashboard when screen exists)
    } catch (error: any) {
      console.error('Failed to save shop details:', error);
      Alert.alert('Error', error.message || 'Failed to save shop details.');
    }
  };

  return (
    <LinearGradient
      colors={['#00C9FF', '#167F97']}
      style={styles.screenBackground}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.mainTitle}>Shop Details</Text>

        <Text style={styles.label}>Shop Name</Text>
        <TextInput
          style={styles.inputField}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#A0A0A0"
        />
        
        <Text style={styles.label}>Shop Address</Text>
        <TextInput // Line 1 from Figma (Rectangle 141)
          style={styles.inputField}
          placeholder="Street Address / Building No."
          value={streetAddress}
          onChangeText={setStreetAddress}
          placeholderTextColor="#A0A0A0"
        />
        <TextInput // Line 2 from Figma (Rectangle 142)
          style={styles.inputField}
          placeholder="Area / Locality"
          value={addressLine2} // This could be part of streetAddress or a separate field if API supports
          onChangeText={setAddressLine2} // For now, not directly mapped to ShopData, can be concatenated
          placeholderTextColor="#A0A0A0"
        />
        <TextInput // Line 3 from Figma (Rectangle 143)
          style={styles.inputField}
          placeholder="Landmark (Optional)"
          value={addressLine3} // Same as above
          onChangeText={setAddressLine3}
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>Shop Category</Text>
        <TextInput // Placeholder for category dropdown (Rectangle 97)
          style={styles.inputField} 
          value={category} 
          onChangeText={(text) => setCategory(text as 'Clothing' | 'Footwear')} // Basic, enhance with Picker
          placeholder="Clothing or Footwear"
          placeholderTextColor="#A0A0A0"
        />

        <View style={styles.row}>
          <View style={styles.inputContainerHalfLeft}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.inputFieldHalf}
              value={city}
              onChangeText={setCity}
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={styles.inputContainerHalfRight}>
            <Text style={styles.label}>State</Text>
            <TextInput
              style={styles.inputFieldHalf}
              value={state}
              onChangeText={setStateValue}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.inputContainerHalfLeft}>
            <Text style={styles.label}>Pincode</Text>
            <TextInput
              style={styles.inputFieldHalf}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={styles.inputContainerHalfRight}>
            <Text style={styles.label}>Country</Text>
            <TextInput
              style={styles.inputFieldHalf}
              value={country}
              onChangeText={setCountry} // Typically 'India' and might not be editable
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.row}> // For Latitude and Longitude
            <View style={styles.inputContainerHalfLeft}>
                <Text style={styles.label}>Latitude</Text>
                <TextInput
                    style={styles.inputFieldHalf}
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="numeric"
                    placeholderTextColor="#A0A0A0"
                />
            </View>
            <View style={styles.inputContainerHalfRight}>
                <Text style={styles.label}>Longitude</Text>
                <TextInput
                    style={styles.inputFieldHalf}
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="numeric"
                    placeholderTextColor="#A0A0A0"
                />
            </View>
        </View>

        <TouchableOpacity style={styles.actionButtonContainer} onPress={handleSaveShopDetails}>
          <LinearGradient
            colors={['#86D0E0', '#3B8FA3']} // Gradient from Figma for button
            style={styles.actionButtonGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
          >
            <Text style={styles.actionButtonText}>Create Shop</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

// Adjusted styles based on Figma CSS and common React Native patterns
const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 31, // left: 31px from Figma
    paddingTop: 54,      // top: 54px for Shop Details title
    paddingBottom: 40,   // For scroll space
  },
  mainTitle: {
    fontFamily: 'Baloo',
    fontSize: 32,
    // lineHeight: 50, // RN handles line height differently
    color: '#000000',
    textAlign: 'center',
    marginBottom: 29, // Approx (116 for Shop Name label top - 54 for title top - 33 for title height)
  },
  label: {
    fontFamily: 'Basic',
    fontSize: 20,
    // lineHeight: 25,
    color: '#000000',
    marginBottom: 5, // Space between label and input (e.g. 146 for input top - 116 for label top - 25 for label height)
  },
  inputField: { // Common style for full-width inputs
    fontFamily: 'Baloo', // Assuming Baloo for input text like SellerOnboarding
    fontSize: 16, // Figma shows 16px for 'Store Category' text inside input
    height: 31,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10, // Default spacing, can be overridden
                     // Shop Name to Shop Address: 187 - (146+31) = 10
                     // Address Line 1 to Line 2: 258 - (217+31) = 10
                     // Address Line 2 to Line 3: 299 - (258+31) = 10
                     // Address Line 3 to Category Label: 340 - (299+31) = 10
                     // Category input to City/State Label: 417 - (371+31) = 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, // Spacing for rows (e.g. City/State to Pincode/Country: 487 - (447+31) = 9)
                     // Pincode/Country to Lat/Long: Assuming similar spacing before button
  },
  inputContainerHalfLeft: {
    width: '48%', // Adjusted for space-between
  },
  inputContainerHalfRight: {
    width: '48%', // Adjusted for space-between
  },
  inputFieldHalf: {
    fontFamily: 'Baloo',
    fontSize: 16,
    height: 31,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    // marginBottom is handled by parent row's marginBottom
  },
  actionButtonContainer: {
    height: 52,
    borderRadius: 26,
    alignSelf: 'stretch',
    marginTop: 35, // Approx from Figma (830 top - previous element)
  },
  actionButtonGradient: {
    flex: 1,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Archivo Black',
    fontSize: 20,
    // lineHeight: 22,
    color: '#FFFFFF',
  },
});

export default ShopDetailsScreen;

