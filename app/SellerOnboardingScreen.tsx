import { LinearGradient } from 'expo-linear-gradient'; // Added LinearGradient
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react'; // Added useEffect
import { Alert, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native'; // Added Platform, ActivityIndicator
import { createSeller, fetchUserMe, SellerCreationResponse } from '../utils/api'; // Added fetchUserMe and SellerCreationResponse
import { useAuth } from '../utils/authContext';

const SellerOnboardingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ phoneNumber?: string }>();
  const { phoneNumber } = params;
  const auth = useAuth();

  const [email, setEmail] = useState('user@example.com');
  const [firstName, setFirstName] = useState('string');
  const [lastName, setLastName] = useState('string');
  const [dobDay, setDobDay] = useState('24');
  const [dobMonth, setDobMonth] = useState('08');
  const [dobYear, setDobYear] = useState('2019');
  const [gender, setGender] = useState('Male');
  const [addressLine1, setAddressLine1] = useState(''); // Address is {} in provided data
  const [addressLine2, setAddressLine2] = useState(''); // Address is {} in provided data
  const [gstNumber, setGstNumber] = useState('string');
  const [accountHolderName, setAccountHolderName] = useState('string');
  const [bankAccountNumber, setBankAccountNumber] = useState('string');
  const [reBankAccountNumber, setReBankAccountNumber] = useState('string'); // Assuming re-entry should match
  const [ifscCode, setIfscCode] = useState('string');
  const [isLoading, setIsLoading] = useState(false); // For loading indicator
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [submitButtonText, setSubmitButtonText] = useState('Next');

  useEffect(() => {
    const loadSellerData = async () => {
      if (!phoneNumber && auth?.isLoggedIn) { // Editing existing seller from settings
        setIsEditingMode(true);
        setSubmitButtonText('Save');
        setIsLoading(true);
        setIsLoading(true);
        try {
          // Assuming fetchUserMe() returns the seller's profile data
          // The response from fetchUserMe is UserProfile, which we updated to include shop_id.
          // For seller-specific details, we might need a dedicated endpoint or ensure fetchUserMe returns all necessary fields.
          // For now, let's assume fetchUserMe returns data compatible with SellerCreationResponse fields for simplicity.
          // Or, if createSeller (PUT /api/seller/v1/me) is the source of truth for all seller fields, 
          // and fetchUserMe only gives basic UserProfile, we might need a GET /api/seller/v1/me
          const existingSellerData = await fetchUserMe() as unknown as SellerCreationResponse; // Casting for now
          
          if (existingSellerData) {
            setEmail(existingSellerData.email || '');
            setFirstName(existingSellerData.first_name || '');
            setLastName(existingSellerData.last_name || '');
            if (existingSellerData.date_of_birth) {
              const [year, month, day] = existingSellerData.date_of_birth.split('-');
              setDobYear(year || '');
              setDobMonth(month || '');
              setDobDay(day || '');
            }
            setGender(existingSellerData.gender || '');
            // Assuming address is an object with line1, line2. Adjust if structure is different.
            if (existingSellerData.address && typeof existingSellerData.address === 'object') {
                setAddressLine1((existingSellerData.address as any).line1 || '');
                setAddressLine2((existingSellerData.address as any).line2 || '');
                // city, state, pincode might also be in existingSellerData.address
            }
            setGstNumber(existingSellerData.gst_number || '');
            setAccountHolderName(existingSellerData.bank_name || '');
            setBankAccountNumber(existingSellerData.bank_account_number || '');
            setReBankAccountNumber(existingSellerData.bank_account_number || ''); // Pre-fill re-entry as well
            setIfscCode(existingSellerData.bank_ifsc_code || '');
          }
        } catch (error) {
          console.error('Failed to load existing seller data:', error);
          Alert.alert('Error', 'Could not load your seller details. Please try again.');
        }
        setIsLoading(false);
      } else { // New user onboarding
        setIsEditingMode(false);
        setSubmitButtonText('Next');
      }
    };

    loadSellerData();
  }, [phoneNumber, auth?.isLoggedIn]);

  const handleSubmit = async () => {
    if (bankAccountNumber !== reBankAccountNumber) {
      Alert.alert('Error', 'Bank account numbers do not match.');
      return;
    }
    const dateOfBirth = `${dobYear}-${dobMonth}-${dobDay}`;
    const sellerData = {
      phone_number: phoneNumber || '',
      email,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender,
      profile_picture: null,
      address: {
        line1: addressLine1,
        line2: addressLine2,
        city: '', state: '', pincode: '', country: '',
      },
      seller_type: 'LOCAL_STORE',
      company_name: null,
      gst_number: gstNumber,
      bank_account_number: bankAccountNumber,
      bank_name: accountHolderName,
      bank_ifsc_code: ifscCode,
    };

    setIsLoading(true);
    try {
      console.log('Submitting seller data:', sellerData);
      const response = await createSeller(sellerData);
      console.log('Seller created/updated:', response);

      if (response && response.id) {
        auth.setSellerId(String(response.id)); // Set sellerId in AuthContext
        console.log('Seller ID set in AuthContext:', auth.sellerId); // Log sellerId from context
      }

      if (isEditingMode) {
        Alert.alert('Success', 'Seller details updated successfully!');
        router.back(); // Go back to the previous screen (Settings)
      } else {
        // New user onboarding flow
        // The check for response && response.id is now done above to setSellerId
        if (auth.sellerId) { // Check if sellerId was successfully set in context
          Alert.alert('Success', 'Seller details submitted successfully!');
          router.push({
            pathname: '/ShopDetailsScreen',
            params: { sellerId: auth.sellerId, phoneNumber: phoneNumber }, 
          });
        } else {
          Alert.alert('Error', 'Failed to get seller ID after creation. Cannot proceed to shop details.');
        }
      }
    } catch (error: any) {
      console.error('Failed to create seller:', error);
      Alert.alert('Error', error.message || 'Failed to submit seller details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (auth && typeof auth.logOut === 'function') { // Changed to logOut
      auth.logOut(); // Call logOut from auth context
    } else {
      console.warn('Auth context or logOut method not available');
      // Potentially clear any local tokens manually if auth.logOut is not found
    }
    router.replace('/'); // Navigate to the root screen (e.g., login)
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
        <Text style={styles.mainTitle}>Seller Details</Text>

        {isLoading && <ActivityIndicator size="large" color="#FFFFFF" style={{ marginVertical: 20 }} />} 
        {/* Hide form or show overlay while isLoading ? */}

        <Text style={styles.label}>E-mail ID</Text>
        <TextInput
          style={styles.inputFieldFull}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#A0A0A0" // Placeholder color from common practice
        />

        <View style={styles.inputRow}>
          <View style={styles.inputContainerHalfLeft}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.inputFieldHalf}
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <View style={styles.inputContainerHalfRight}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.inputFieldHalf}
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainerDob}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.dobFieldsContainer}>
              <TextInput
                style={styles.inputFieldDob}
                placeholder="DD"
                value={dobDay}
                onChangeText={setDobDay}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor="#111010"
              />
              <TextInput
                style={styles.inputFieldDob}
                placeholder="MM"
                value={dobMonth}
                onChangeText={setDobMonth}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor="#111010"
              />
              <TextInput
                style={styles.inputFieldDob}
                placeholder="YYYY"
                value={dobYear}
                onChangeText={setDobYear}
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor="#111010"
              />
            </View>
          </View>
          <View style={styles.inputContainerGender}>
            <Text style={styles.label}>Gender</Text>
            <TextInput // Consider using a Picker or custom dropdown for Gender
              style={styles.inputFieldHalf}
              value={gender}
              onChangeText={setGender}
              placeholderTextColor="#A0A0A0"
            />
          </View>
        </View>

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.inputFieldFull}
          placeholder="Line 1"
          value={addressLine1}
          onChangeText={setAddressLine1}
          placeholderTextColor="#A0A0A0"
        />
        <TextInput
          style={styles.inputFieldFull}
          placeholder="Line 2 (Optional)"
          value={addressLine2}
          onChangeText={setAddressLine2}
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>GST Number</Text>
        <TextInput
          style={styles.inputFieldFull}
          value={gstNumber}
          onChangeText={setGstNumber}
          autoCapitalize="characters"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>Account holder name</Text>
        <TextInput
          style={styles.inputFieldFull}
          value={accountHolderName}
          onChangeText={setAccountHolderName}
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>Bank account number</Text>
        <TextInput
          style={styles.inputFieldFull}
          value={bankAccountNumber}
          onChangeText={setBankAccountNumber}
          keyboardType="numeric"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>Re-enter bank account number</Text>
        <TextInput
          style={styles.inputFieldFull}
          value={reBankAccountNumber}
          onChangeText={setReBankAccountNumber}
          keyboardType="numeric"
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.label}>IFSC code</Text>
        <TextInput
          style={styles.inputFieldFull}
          value={ifscCode}
          onChangeText={setIfscCode}
          autoCapitalize="characters"
          placeholderTextColor="#A0A0A0"
        />

        <TouchableOpacity onPress={handleSubmit} style={styles.nextButtonContainer}>
          <LinearGradient colors={['#FF6B00', '#FF9900']} style={styles.nextButtonGradient}>
            <Text style={styles.buttonText}>{submitButtonText}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={[styles.buttonBase, styles.logoutButton]}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  screenBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 31,
    paddingTop: 54,
    paddingBottom: 40, // Increased bottom padding for scroll comfort
  },
  mainTitle: {
    fontFamily: 'Baloo',
    fontSize: 32,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 29,
  },
  label: {
    fontFamily: 'Basic',
    fontSize: 20,
    color: '#000000',
    marginBottom: 5,
  },
  inputFieldFull: {
    fontFamily: 'Baloo',
    fontSize: 18,
    height: 52, // Adjusted height for better fit with font size and padding
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 20, // Added default marginBottom for spacing
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0, 
  },
  inputContainerHalfLeft: {
    flex: 1,
    marginRight: 5, 
  },
  inputContainerHalfRight: {
    flex: 1,
    marginLeft: 5, 
  },
  inputFieldHalf: {
    fontFamily: 'Baloo',
    fontSize: 16,
    color: '#111010',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    marginBottom: 20,
    height: 52,
  },
  inputContainerDob: {
    flex: 0.6, 
    marginRight: 5,
  },
  dobFieldsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputFieldDob: {
    fontFamily: 'Baloo',
    fontSize: 16,
    color: '#111010',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 10, 
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    textAlign: 'center',
    marginBottom: 20,
    height: 52,
    width: '30%', 
  },
  inputContainerGender: {
    flex: 0.4, 
    marginLeft: 5,
  },
  nextButtonContainer: {
    height: 52, 
    borderRadius: 26, 
    marginTop: 30, // Increased margin for better separation
    alignSelf: 'stretch', 
    overflow: 'hidden', 
  },
  nextButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontFamily: 'Archivo Black', 
    fontSize: 20,
    color: '#FFFFFF',
  },
  buttonBase: { // Combined common button styles
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 15, // Margin for buttons
    marginBottom: 10, // Space at the bottom if it's the last element
  },
  logoutButton: { // Specific style for logout button
    backgroundColor: '#d9534f', // A common color for logout/danger buttons
  },
  buttonText: { // Text style for all buttons
    fontFamily: 'Archivo Black',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default SellerOnboardingScreen;
