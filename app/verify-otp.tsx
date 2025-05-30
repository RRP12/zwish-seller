import { sendOtp, verifyOtp } from "@/utils/api";
import { useAuth } from "@/utils/authContext";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { createRef, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 1191796852
export default function VerifyOtpScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const phoneNumber = params.phoneNumber as string;
  const [otp, setOtp] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const authContext = useAuth();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setIsResending(true);
    try {
      // Call API to resend OTP
      await sendOtp(phoneNumber, "seller");
      
      // Disable resend button for 30 seconds
      setResendDisabled(true);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to resend OTP. Please try again.'
      );
      console.error('Failed to resend OTP:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifying(true);
    // Ensure phoneNumber is a string, not an array
    const phoneNumber = Array.isArray(params?.phoneNumber) 
      ? params?.phoneNumber[0] 
      : params?.phoneNumber;
      
    try {
      const res = await verifyOtp(phoneNumber, otp, "seller");
      
      if (res && typeof res.accessToken === 'string' && typeof res.refreshToken === 'string' && typeof res.isNew === 'boolean') {
        authContext.logIn(res.accessToken, res.refreshToken, res.isNew);
        if (res.isNew) {
          router.replace({ pathname: '/SellerOnboardingScreen', params: { phoneNumber: phoneNumber } });
        } else {
          // User is not new, navigate to the root screen
          router.replace({ pathname: '/' }); 
        }
      } else {
        throw new Error('Invalid authentication response');
      }
    } catch (err: unknown) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (typeof err === 'object' && err !== null) {
        // Attempt to treat as an Axios-like error or a standard Error object
        const errorAsAxios = err as { response?: { status?: number; data?: any }; message?: string };

        if (errorAsAxios.response && typeof errorAsAxios.response.status === 'number') {
          if (errorAsAxios.response.status === 401) {
            errorMessage = 'Invalid OTP. Please try again.';
          } else if (errorAsAxios.response.status === 429) {
            errorMessage = 'Too many attempts. Please try again later.';
          } else {
            // You could potentially use errorAsAxios.response.data for more specific server messages
            errorMessage = `Server error (${errorAsAxios.response.status}). Please try again.`;
          }
        } else if (errorAsAxios.message) {
          // If it's not an Axios-like error but has a .message (e.g. standard Error)
          errorMessage = errorAsAxios.message;
        }
      } else if (typeof err === 'string') {
        // If the error thrown was a simple string
        errorMessage = err;
      }
      // For other types of errors, the default errorMessage will be used.

      Alert.alert('Error', errorMessage);
      console.error("OTP verification failed:", err); // Log the original error object
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.contentContainer}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../assets/images/delivery-concept-Le2doLZEDt.jpg')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
        
        {/* OTP Header */}
        <Text style={styles.title}>OTP Verification</Text>
        <Text style={styles.subtitle}>
          Enter the OTP sent to +91 {phoneNumber}
        </Text>
        
        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <View style={styles.otpContainerStyle}>
            {/* Create 4 individual text inputs for OTP */}
            {(() => {
              const inputRefs = Array(6).fill(0).map(() => createRef<TextInput>());
              
              return [0, 1, 2, 3, 4, 5].map((index) => (
                <TextInput
                  key={index}
                  ref={inputRefs[index]}
                  style={styles.otpInputStyle}
                  maxLength={1}
                  keyboardType="number-pad"
                  onChangeText={(text: string) => {
                    const newOtp = otp.split('');
                    newOtp[index] = text;
                    setOtp(newOtp.join(''));
                    
                    // Auto-focus to next input if text is entered
                    if (text && index < 5) {
                      inputRefs[index + 1].current?.focus();
                    }
                  }}
                  value={otp[index] || ''}
                />
              ));
            })()}
          </View>
        </View>
        
        {/* Resend OTP */}
        <TouchableOpacity 
          onPress={handleResendOtp}
          disabled={resendDisabled}
          style={styles.resendContainer}
        >
          <View style={styles.resendWrapper}>
            {isResending && <ActivityIndicator size="small" color="#FFFFFF" style={{marginRight: 8}} />}
            <Text style={[styles.resendText, resendDisabled && styles.resendDisabled]}>
              {resendDisabled ? `Resend OTP (${timer}s)` : 'Resend OTP'}
            </Text>
          </View>
        </TouchableOpacity>
        
        {/* Confirm Button */}
        <TouchableOpacity 
          style={styles.buttonContainer} 
          onPress={handleVerifyOtp}
          activeOpacity={0.8}
          disabled={isVerifying}
        >
          <LinearGradient
            colors={['#86D0E0', '#3B8FA3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.confirmButton}
          >
            {isVerifying ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Terms and Policy */}
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
    alignItems: 'center',
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  illustration: {
    width: 200, 
    height: 150,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  otpContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  otpContainerStyle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  otpInputStyle: {
    width: 45,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 22,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold',
    marginHorizontal: 3,
  },
  resendContainer: {
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  resendWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationLine: 'none',
  },
  resendDisabled: {
    opacity: 0.6,
  },
  buttonContainer: {
    position: 'relative',
    width: 351,
    height: 52,
    alignSelf: 'center',
  },
  confirmButton: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmButtonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  termsText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  termsLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});
