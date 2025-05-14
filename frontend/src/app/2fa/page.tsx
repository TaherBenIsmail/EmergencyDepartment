"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const TwoFactorAuth: React.FC = () => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(4).fill(""));
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));
  const router = useRouter();

  // Retrieve userId from localStorage and start countdown on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      console.log("✅ Found userId:", storedUserId);
      setUserId(storedUserId);
      // Start with 60 seconds countdown for resend
      setCountdown(60);
    } else {
      console.error("❌ No userId found. Redirecting to Sign In...");
      showError("Session expired, please log in again.");
      setTimeout(() => router.push("/signin"), 2000);
    }
  }, [router]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown]);

  // Helper to show error message with auto-dismiss
  const showError = (message: string) => {
    setError(message);
    setSuccess(null);
    setTimeout(() => setError(null), 5000);
  };

  // Helper to show success message with auto-dismiss
  const showSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
    setTimeout(() => setSuccess(null), 5000);
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtpValues = [...otpValues];
    
    // Handle paste event (multiple digits)
    if (value.length > 1) {
      const pastedValues = value.split("");
      for (let i = 0; i < 4; i++) {
        if (i < pastedValues.length) {
          newOtpValues[i] = pastedValues[i];
        }
      }
      setOtpValues(newOtpValues);
      // Focus last field or the next empty field
      const lastIndex = Math.min(index + pastedValues.length, 3);
      inputRefs.current[lastIndex]?.focus();
      return;
    }

    // Handle single digit
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus next input if current field is filled
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      // If current field is empty and backspace is pressed, focus previous field
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = otpValues.join("");

    if (!userId) {
      showError("User session expired. Please sign in again.");
      setTimeout(() => router.push("/signin"), 2000);
      return;
    }

    if (otp.length !== 4) {
      showError("Please enter all 4 digits of the OTP code.");
      return;
    }

    setLoading(true);
    setError(null);
    console.log("📤 Sending OTP:", { userId, otp });

    try {
      const response = await axios.post(
        "http://localhost:3000/user/verifyOTP",
        { userId, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ OTP Verification Response:", response.data);

      if (response.data.status === "SUCCESS") {
        const role = response.data.user.role;
        localStorage.setItem("token", response.data.token);
        window.dispatchEvent(new Event("refresh-user"));
        
        showSuccess("Verification successful! Redirecting...");
        
        setTimeout(() => {
          if (role === "admin") {
            window.location.href = "http://localhost:3002/";
          } else {
            router.push("/");
          }
        }, 1000);
      } else {
        showError(response.data.message || "Incorrect OTP code. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error verifying OTP:", error.response?.data || error);
      showError("Verification failed. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    if (!userId) {
      showError("User session expired. Please sign in again.");
      setTimeout(() => router.push("/signin"), 2000);
      return;
    }

    if (countdown > 0) return;

    setLoading(true);
    console.log("📤 Requesting new OTP for userId:", userId);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/resendOTP",
        { userId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === "SUCCESS") {
        showSuccess("New OTP has been sent to your email!");
        setCountdown(60); // Reset countdown
      } else {
        showError(response.data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("❌ Error resending OTP:", error.response?.data || error);
      showError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[180px]">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <div className="shadow-lg rounded-xl bg-white px-8 py-10 dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
              <h3 className="mb-2 text-center text-2xl font-bold text-gray-800 dark:text-white">
                Two-Factor Authentication
              </h3>
              <p className="mb-8 text-center text-gray-600 dark:text-gray-300">
                Please enter the 4-digit verification code sent to your email
              </p>

              {/* Status Messages */}
              {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/30">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-4 rounded-md bg-green-50 p-4 dark:bg-green-900/30">
                  <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleVerifyOTP} className="mt-6">
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Verification Code
                  </label>
                  <div className="flex justify-center gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        ref={(el) => {inputRefs.current[index] = el}}
                        type="text"
                        maxLength={4}
                        value={otpValues[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="h-14 w-14 rounded-md border border-gray-300 bg-white text-center text-xl font-semibold text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        required
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mb-6">
                  <button
                    type="submit"
                    className="w-full rounded-md bg-blue-600 py-3.5 text-base font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2">Verifying...</span>
                      </span>
                    ) : (
                      "Verify Code"
                    )}
                  </button>
                </div>
              </form>

              {/* Resend OTP */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Didn't receive the code?{" "}
                  <button
                    onClick={handleResendOTP}
                    className={`font-medium ${
                      countdown > 0 
                        ? "text-gray-400 cursor-not-allowed dark:text-gray-500" 
                        : "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    }`}
                    disabled={loading || countdown > 0}
                    type="button"
                  >
                    
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwoFactorAuth;