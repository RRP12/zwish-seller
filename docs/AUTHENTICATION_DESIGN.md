# Authentication Design (OTP-Based)

## 1. Overview

This document outlines the design of the One-Time Password (OTP) based authentication system. This system allows users to log in or register using their phone number and an OTP sent via SMS. Upon successful verification, the system issues access and refresh tokens to maintain the user's session.

## 2. Key Files

The core logic for this authentication system is implemented across the following files:

*   `utils/authContext.tsx`: Manages the authentication state (user, tokens) and provides it to the application.
*   `utils/apiClient.ts`: An Axios instance configured to automatically include the access token in API requests and handle token refresh logic.
*   `utils/api.ts`: Contains functions for making API calls related to authentication (`sendOtp`, `verifyOtp`, `refreshToken`).
*   `app/login.tsx`: The screen where users initiate the login process by providing their phone number.
*   `app/verify-otp.tsx`: The screen where users enter the OTP received via SMS to complete the verification.

## 3. Authentication Flow

The authentication process follows these steps:

1.  **Login Initiation**:
    *   The user enters their phone number on the `app/login.tsx` screen.
    *   The `sendOtp` function from `utils/api.ts` is called, which makes a POST request to the `/api/auth/v1/send-otp` endpoint.
    *   The API sends an OTP to the provided phone number.

2.  **OTP Verification**:
    *   The user is navigated to the `app/verify-otp.tsx` screen and enters the received OTP.
    *   The `verifyOtp` function from `utils/api.ts` is called, making a POST request to the `/api/auth/v1/verify-otp` endpoint with the phone number and OTP.
    *   Upon successful verification, the API returns an access token and a refresh token.

3.  **Session Creation & Token Storage**:
    *   The received access and refresh tokens are stored securely using `expo-secure-store`.
    *   The `AuthContext` (`utils/authContext.tsx`) is updated with the user's authentication status and tokens. This makes the session information available globally within the app.

4.  **Navigation**:
    *   Based on the API response (or application logic), the user is navigated to the appropriate screen:
        *   **New users**: Might be directed to a profile creation or onboarding screen.
        *   **Existing users**: Directed to the main application dashboard or home screen.

## 4. Token Management

### Access Token

*   **Usage**: The access token is a short-lived credential used to authenticate API requests.
*   **Storage**: Stored securely using `expo-secure-store` under the key `accessToken`.
*   **Inclusion in API Calls**: The `apiClient` (`utils/apiClient.ts`) is configured with a request interceptor that automatically attaches the access token to the `Authorization` header of outgoing requests (e.g., `Bearer <accessToken>`).

### Refresh Token

*   **Usage**: The refresh token is a long-lived credential used to obtain a new access token when the current one expires.
*   **Storage**: Stored securely using `expo-secure-store` under the key `refreshToken`.

### Secure Storage

*   The `expo-secure-store` library is used to store tokens on the device in an encrypted format, enhancing security.

## 5. Refresh Token Logic

The system automatically attempts to refresh the access token when it expires:

1.  **Trigger**:
    *   If an API call made via `apiClient` returns a `401 Unauthorized` error, it signifies that the access token has expired or is invalid.
    *   The response interceptor in `apiClient.ts` catches this error.

2.  **Process**:
    *   The interceptor calls the `refreshToken` function from `utils/api.ts`.
    *   This function makes a POST request to the `/refresh` endpoint (Base URL: `https://zwishh-gateway-ce7mtpkb.an.gateway.dev`), sending the stored refresh token.
    *   If successful, the API returns a new access token and potentially a new refresh token.
    *   The `AuthContext` and `SecureStore` are updated with the new tokens.
    *   The original failed API request is retried with the new access token.

3.  **Failure Handling**:
    *   If the `/refresh` call fails (e.g., invalid refresh token, network error), the user is logged out.
    *   This involves clearing the tokens from `SecureStore` and resetting the `AuthContext`.

## 6. Logout Process

When a user logs out:

*   The `logout` function in `AuthContext` is called.
*   Access and refresh tokens are removed from `SecureStore`.
*   The authentication state in `AuthContext` is reset (e.g., user set to `null`, tokens cleared).
*   The user is typically navigated back to the `app/login.tsx` screen.

## 7. API Endpoints

The authentication system relies on the following API endpoints:

*   **Send OTP**: `POST /api/auth/v1/send-otp`
    *   **Request Body**: `{ phoneNumber: string, role?: string }`
    *   **Response**: Success/failure message.
*   **Verify OTP**: `POST /api/auth/v1/verify-otp`
    *   **Request Body**: `{ phoneNumber: string, otp: string, role?: string }`
    *   **Response**: `{ accessToken: string, refreshToken: string, userDetails: object }` (or similar structure)
*   **Refresh Token**: `POST /refresh` (Base URL: `https://zwishh-gateway-ce7mtpkb.an.gateway.dev`)
    *   **Request Body**: `{ refreshToken: string }`
    *   **Response**: `{ accessToken: string, refreshToken?: string }` (refreshToken might be reissued)

## 8. Potential Considerations (Minor)

*   **Role Parameter Handling**: The `role` parameter in `sendOtp` and `verifyOtp` calls needs to be handled consistently if different user roles have distinct authentication flows or permissions. Current implementation details for this are not fully specified but should be considered for future enhancements.
*   **Granularity of Error Handling in Token Refresh**: The current refresh token logic handles success or logs out on failure. More granular error handling could be implemented (e.g., specific actions for different error types from the `/refresh` endpoint, like "invalid refresh token" vs. "server error").
