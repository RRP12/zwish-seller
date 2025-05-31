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
  shop_id?: string; // Added shop_id for existing users with shops
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
 * @param role User role (default: "seller")
 * @returns Auth response with tokens and user data
 */
async function verifyOtp(phoneNumber: string, otp: string, role = "seller"): Promise<AuthResponse> {
  try {
    const response = await apiClient.post("/api/auth/v1/verify-otp", { 
      phone_number: phoneNumber, 
      otp, 
      role 
    });
    const data = response.data;
    
    // Validate response structure
    if (!data || typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string' || 
        typeof data.is_new !== 'boolean') {
      console.error("verifyOtp: Received malformed response data:", data);
      throw new Error("Invalid authentication response structure from server.");
    }
    
    // Create a temporary user object until we can fetch the actual user data
    const tempUser: UserProfile = {
      id: '1', // This will be updated with fetchUserMe later
      phone: phoneNumber,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      user: tempUser, // Use the temporary user object
      isNew: data.is_new,
    };
  } catch (error) {
    console.error(`verifyOtp error for phone: ${phoneNumber}, role: ${role}`);
    
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      
      const backendError = error.response?.data;
      let errorMessage = "OTP verification failed. Please try again.";
      
      if (backendError && typeof backendError === 'object') {
        if (typeof backendError.message === 'string') {
          errorMessage = backendError.message;
        } else if (typeof backendError.detail === 'string') {
          errorMessage = backendError.detail;
        } else if (typeof backendError.error === 'string') {
          errorMessage = backendError.error;
        }
      } else if (typeof backendError === 'string') {
        errorMessage = backendError;
      }
      
      throw new Error(errorMessage);
    }
    throw error;
  }
}

/**
 * Fetch current user profile
 * @returns User profile data
 */
async function fetchUserMe(): Promise<UserProfile> {
  const response = await apiClient.get("/api/user/v1/me");
  return response.data as UserProfile;
}

/**
 * Update user profile
 * @param data Profile data to update
 * @returns Updated user profile data
 */
async function updateUserProfile(data: ProfileUpdateData): Promise<UserProfile> {
  const response = await apiClient.put("/api/user/v1/profile", data);
  return response.data as UserProfile;
}

/**
 * Create a new address for the user.
 * @param addressData Data for the new address.
 * @returns The created address data.
 */
export async function createAddress(addressData: Omit<Address, 'id' | 'is_default'>): Promise<Address> {
  try {
    const response = await apiClient.post("/api/user/v1/addresses", addressData);
    return response.data as Address;
  } catch (error) {
    console.error('Error creating address:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || error.message || 'Failed to create address');
    } else if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while creating address');
  }
}

// Seller Data Interface
export interface SellerData {
  name: string;
  email: string;
  dob: string; // Format YYYY-MM-DD
  gender: "Male" | "Female" | "Other";
  gst_number?: string; // Optional
  // Bank details
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
}

/**
 * Create or update seller details.
 * @param sellerData Data for the seller.
 * @returns The created/updated seller's profile data.
 */
export async function createOrUpdateSellerDetails(sellerData: SellerData): Promise<UserProfile> { // Assuming it returns the updated UserProfile
  try {
    const response = await apiClient.post("/api/seller/v1/details", sellerData); // Adjust endpoint if it's PUT or different
    return response.data as UserProfile; // Adjust response type as needed
  } catch (error) {
    console.error('Error submitting seller details:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || error.response.data?.detail || error.message || 'Failed to submit seller details');
    } else if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while submitting seller details');
  }
}

// Shop Interface (as returned by API)
export interface Shop {
  id: string; // Or number, depending on your API
  name: string;
  category: "Clothing" | "Footwear"; // Or whatever categories you have, ensure this matches SellerOnboardingScreen
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
  seller_id: number; // This seems to be the user ID, confirm if shop_id is different
  // ... any other fields returned by the API for a shop
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
export async function createShop(shopData: ShopData): Promise<Shop> { // Changed 'any' to 'Shop'
  try {
    console.log("Submitting shop data:", shopData);
    const response = await apiClient.post("/api/seller/v1/shops", shopData);
    console.log("Shop created successfully:", response.data);
    return response.data as Shop;
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
  AuthResponse,
  createOrUpdateSellerDetails, // Added export


  // createShop is exported at its definition
  fetchUserMe, OtpResponse, ProfileUpdateData,
  SellerData,
  // ShopData is exported at its definition
  sendOtp, updateUserProfile, UserProfile,
  verifyOtp // Explicitly exported to fix the undefined function error
};

