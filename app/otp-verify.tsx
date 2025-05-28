import { useSession } from "@/ctx"
import { verifyOtp } from "@/utils/sendotp"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { OtpInput } from "react-native-otp-entry"
import { Ionicons } from '@expo/vector-icons'

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { signIn } = useSession();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;

  const handleBack = () => {
    router.back();
  };

  async function handleVerifyOtp() {
    if (otp.length < 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await verifyOtp(phoneNumber, otp);
      console.log("OTP verification response:", data);
      const { access_token } = data || {};

      if (access_token) {
        console.log("Access token received, signing in...");
        await signIn(access_token);
        console.log("Signed in, navigating to home");
        router.push("/(app)");
      } else {
        setError('Invalid OTP. Please try again.');
        console.log("No access token in response");
      }
    } catch (error) {
      console.error("Error in OTP verification:", error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verify OTP</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We have sent a verification code to {phoneNumber}
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OtpInput 
            onTextChange={(text) => {
              setOtp(text);
              setError(null);
            }}
            numberOfDigits={6}
            focusColor="#00C9FF"
            focusStickBlinkingDuration={500}
            autoFocus
          />
        </View>

        {/* Error message */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Verify Button */}
        <TouchableOpacity 
          style={styles.verifyButton} 
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        {/* Resend OTP */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendButton}>Resend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#00C9FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  resendText: {
    color: '#888',
  },
  resendButton: {
    color: '#00C9FF',
    fontWeight: 'bold',
  },
})
