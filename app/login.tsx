
import { sendOtp } from "@/utils/api";
import { useAuth } from "@/utils/authContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Alert, GestureResponderEvent, Image, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const authContext = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (event: GestureResponderEvent | undefined) => {
    // Here you would typically use values from a form or API response
    // This is just a placeholder with test values
    authContext.logIn('test_access_token', 'test_refresh_token');
  };
  
  const handleContinue = async () => {
    // Validate phone number - ensure it's 10 digits
    if (phoneNumber.trim().length === 10) {
      setIsLoading(true);
      
      try {
        // Call API to send OTP
        const result = await sendOtp(phoneNumber);
        setIsLoading(false);
        
        // Navigate to OTP verification screen
        router.push({
          pathname: '/verify-otp',
          params: { phoneNumber }
        });
      } catch (error) {
        setIsLoading(false);
        Alert.alert(
          'Error',
          'Failed to send OTP. Please try again.'
        );
        console.error('Failed to send OTP:', error);
      }
    } else {
      // Show validation error
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>
          Get your perfect
          <Text style={styles.heading}> style in minutes</Text>
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.prefix}>+91</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number"
            placeholderTextColor="rgba(0,0,0,0.5)"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#86D0E0', '#3B8FA3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../assets/images/delivery-concept-Le2doLZEDt.jpg')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text 
            style={styles.termsLink}
            onPress={() => Linking.openURL('https://zwishh.com/terms')}
          >
            Terms of Use
          </Text>{' '}
          &{' '}
          <Text 
            style={styles.termsLink}
            onPress={() => Linking.openURL('https://zwishh.com/privacy')}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00C9FF',
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 30,
    marginTop: 60,
    paddingHorizontal: 16,
    height: 56,
  },
  prefix: {
    fontSize: 16,
    marginRight: 8,
    color: 'black',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    height: '100%',
  },
  buttonContainer: {
    position: 'relative',
    width: 351,
    height: 52,
    marginTop: 20,
    alignSelf: 'center',
  },
  continueButton: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
   
   
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  illustration: {
    width: 250,
    height: 250,
  },
  illustrationPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationText: {
    fontSize: 100,
  },
  termsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  termsLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});