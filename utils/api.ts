import apiClient from "./apiClient";

// Type definitions
interface OtpResponse {
  message: string;
  status: number;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

interface UserProfile {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

interface ProfileUpdateData {
  name?: string;
  email?: string;
  profile_image?: string;
}

interface Address {
  id?: string;
  name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  is_default?: boolean;
}

/**
 * Send OTP to the specified phone number
 * @param phoneNumber Phone number to send OTP to
 * @param role User role (default: "user")
 * @returns Message and status response
 */
async function sendOtp(phoneNumber: string, role = "user"): Promise<OtpResponse> {
  const response = await apiClient.post("/api/auth/v1/send-otp", { 
    phone_number: phoneNumber, 
    role 
  });
  return { message: response.data, status: response.status };
}

/**
 * Verify OTP for the specified phone number
 * @param phoneNumber Phone number that received the OTP
 * @param otp OTP code to verify
 * @param role User role (default: "user")
 * @returns Auth response with tokens and user data
 */
async function verifyOtp(phoneNumber: string, otp: string, role = "user"): Promise<AuthResponse> {
  const response = await apiClient.post("/api/auth/v1/verify-otp", { 
    phone_number: phoneNumber, 
    otp, 
    role 
  });
  const data = response.data;
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user, // If needed, map user fields here as well
  };
}

/**
 * Fetch current user profile
 * @returns User profile data
 */
async function fetchUserMe(): Promise<UserProfile> {
  const response = await apiClient.get("/api/user/v1/me");
  return response.data;
}

/**
 * Update user profile information
 * @param profileData Profile data to update
 * @returns Updated user profile
 */
async function updateUserProfile(profileData: ProfileUpdateData): Promise<UserProfile> {
  const response = await apiClient.put("/api/user/v1/me", profileData);
  return response.data;
}

/**
 * Create a new address for the user
 * @param addressData Address data to create
 * @returns Created address
 */
async function createAddress(addressData: Address): Promise<Address> {
  const response = await apiClient.post("/api/user/v1/addresses", addressData);
  return response.data;
}

export {
  Address, AuthResponse, createAddress, fetchUserMe,
  // Type exports
  OtpResponse, ProfileUpdateData, sendOtp, updateUserProfile, UserProfile, verifyOtp
};

