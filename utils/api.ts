import axios from 'axios'; // Import axios to use isAxiosError for better error handling
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
  isNew: boolean; // Added isNew flag
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
async function sendOtp(phoneNumber: string, role = "seller"): Promise<OtpResponse> {
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
    user: data.user,
    isNew: data.is_new, // Extract and map is_new from API response
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

// Seller Onboarding Data Interface
interface SellerData {
  phone_number: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null; // YYYY-MM-DD
  gender: string | null;
  profile_picture: string | null;
  address: object | null; // Consider a more specific type e.g., { line1: string, line2?: string, city: string, ... }
  seller_type: string | null;
  company_name: string | null;
  gst_number: string | null;
  bank_account_number: string | null;
  bank_name: string | null;
  bank_ifsc_code: string | null;
}

/**
 * Create a new seller profile.
 * @param sellerData Data for the new seller.
 * @returns The created seller's data.
 */
async function createSeller(sellerData: SellerData): Promise<any> { // Replace 'any' with a more specific return type if available
  try {

    console.log("sellerData",sellerData);
    
    // Using apiClient which should have base URL and interceptors configured
    const response = await apiClient.put("/api/seller/v1/me", sellerData);
    return response.data;
  } catch (error) {
    console.error('Error creating seller:', error);
    // apiClient might throw AxiosError, which has a response object
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || error.message || 'Failed to create seller');
    } else if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while creating seller');
  }
}

// Shop Data Interface for creation
export interface ShopData {
  name: string;
  category: "Clothing" | "Footwear";
  is_flagship?: boolean;
  profile_picture?: string | null;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_active?: boolean;
  latitude: number;
  longitude: number;
  is_open?: boolean;
  seller_id: number;
}

/**
 * Create a new shop.
 * @param shopData Data for the new shop.
 * @returns The created shop's data.
 */
export async function createShop(shopData: ShopData): Promise<any> { // Replace 'any' with a more specific return type
  try {

    
    console.log("Submitting shop data:", shopData);
    const response = await apiClient.post("/api/seller/v1/shops", shopData);
    console.log("Shop created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating shop:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Server error response data:', error.response.data); // Log the full response data for 500 errors
      throw new Error(error.response.data?.message || error.response.data?.detail || error.message || 'Failed to create shop');
    } else if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while creating shop');
  }
}

export {
  Address,
  AuthResponse, createAddress,
  createSeller
  // createShop is exported at its definition
  ,













  fetchUserMe, OtpResponse, ProfileUpdateData,
  SellerData,
  // ShopData is exported at its definition
  sendOtp, updateUserProfile, UserProfile, verifyOtp
};

