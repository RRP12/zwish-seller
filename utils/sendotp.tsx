import axios from "axios"

async function sendOtp(phoneNumber, role = "user") {
  try {
    const response = await axios.post(
      "https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/auth/v1/send-otp",
      {
        phone_number: phoneNumber,
        role: role,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    console.log("OTP Sent:", response.data)
    return { message: response.data, status: response.status }
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message)
    throw error
  }
}

async function verifyOtp(phoneNumber, otp, role = "user") {
  try {
    const response = await axios.post(
      "https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/auth/v1/verify-otp",
      {
        phone_number: phoneNumber,
        otp: otp,
        role: role,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    console.log("OTP Verified:", response.data)
    return response.data
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message)
    throw error
  }
}

async function fetchUserMe(baseUrl: string, token?: string): Promise<any> {
  const url = `${baseUrl.replace(/\/+$/, "")}/api/user/v1/me`
  const headers: Record<string, string> = {
    Accept: "application/json",
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  })

  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`
    try {
      const body = await response.json()
      errorMsg += body?.message
        ? `: ${body.message}`
        : `: ${JSON.stringify(body)}`
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(`Failed to fetch user/me — ${errorMsg}`)
  }

  return response.json()
}

async function createUserProfile(profileData, jwtToken) {
  console.log("jwtToken", jwtToken)

  try {
    const response = await fetch(
      "https://zwishh-gateway-ce7mtpkb.an.gateway.dev/api/user/v1/me",
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(profileData),
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `Error ${response.status}: ${errorData.message || "Unknown error"}`
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error creating user profile:", error)
    throw error
  }
}

export { createUserProfile, fetchUserMe, sendOtp, verifyOtp }
