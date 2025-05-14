"use client";

import React, { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Webcam from "react-webcam";

const SigninPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("email"); // "email" or "face"

  // ✅ Check Active Session on Page Load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionResponse = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true,
        });

        if (sessionResponse.data.user) {
          console.log("✅ Session Active:", sessionResponse.data.user);
          router.push("/");
        }
      } catch (error) {
        console.error("❌ No Active Session:", error);
      }
    };

    checkSession();
  }, [router]);

  // 🔹 Handle Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Convert Base64 Image to File
  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // 🔹 Capture Image from Webcam
  const capture = () => {
    const image = webcamRef.current?.getScreenshot();
    if (image) setImageSrc(image);
  };

  // 🔹 Handle Form Submission (Email & Password)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/user/signin",
        formData,
        { withCredentials: true }
      );

      if (response.data.status === "PENDING") {
        localStorage.setItem("userId", response.data.data.userId);
        router.push("/2fa");
      } else if (response.data.status === "SUCCESS") {
        localStorage.setItem("token", response.data.token);
        alert("✅ Login Successful!");
        router.push("/");
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      console.error("❌ Login Error:", error.response?.data || error);
      alert("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Face Login
  const handleFaceLogin = async () => {
    if (!imageSrc) return alert("Please capture an image first!");

    const formData = new FormData();
    formData.append("image", dataURLtoFile(imageSrc, "face-login.jpg"));

    try {
      const response = await axios.post("http://localhost:3000/user/face-login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // ✅ Ensures cookies are sent
      });

      console.log("✅ Face Login Response:", response.data);

      if (response.data.token) {
        console.log("✅ Storing token:", response.data.token);
        alert("✅ Face Login Successful!");
        router.push("/");
      } else {
        alert(response.data.message);
      }
    } catch (error: any) {
      console.error("❌ Face Login Error:", error.response?.data || error);
      alert("Face Login Failed");
    }
  };

  // 🔹 Request Password Reset
  const requestPasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = prompt("Enter your email to reset your password:");
    if (!email) return;

    try {
      const response = await axios.post("http://localhost:3000/user/requestPasswordReset", {
        email,
        redirectUrl: "http://localhost:3001/reset-password", // 🔁 Change this to your actual frontend URL
      });

      alert(response.data.message);
    } catch (error: any) {
      console.error("❌ Password Reset Error:", error.response?.data || error);
      alert("Password reset request failed.");
    }
  };
{/* 
            <Link href="/3d-human" className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors">
              3D Human Viewer
            </Link> */}
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation Bar */}


      {/* Main Content */}
      <section className="relative pt-28 pb-20 px-4 md:px-8 flex items-center justify-center min-h-screen">
        <div className="container mx-auto max-w-5xl">
          {/* Background Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute -bottom-24 right-1/3 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
          </div>

          {/* Card Container */}
          <div className="relative z-10 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
            {/* Left Section - Image/Branding */}
            <div className="lg:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-10 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                <p className="text-indigo-100 mb-8">
                  Access your account and continue your secure journey with us.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Enhanced security with facial recognition</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Multiple login options for convenience</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-white/20 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p>Secure and encrypted data transmission</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-sm text-indigo-200">
                  Don't have an account yet?
                </p>
                <Link href="/signup" className="inline-block mt-2 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white font-medium">
                  Create Account
                </Link>
              </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="lg:w-2/3 p-8 md:p-12">
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                <button
                  onClick={() => setActiveTab("email")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === "email"
                      ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                      : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  }`}
                >
                  <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email Login
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab("face")}
                  className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
                    activeTab === "face"
                      ? "text-indigo-600 border-b-2 border-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
                      : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  }`}
                >
                  <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Face Login
                  </div>
                </button>
              </div>

              {/* Email Login Form */}
              {activeTab === "email" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                    Sign in to your account
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex justify-center items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Login */}
                  <div className="mt-8">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => window.open("http://localhost:3000/user/auth/google", "_self")}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img src="/images/google.png" alt="Google logo" className="h-5 w-5 mr-2" />
                        Google
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open("http://localhost:3000/user/auth/facebook", "_self")}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <img src="/images/facebook.png" alt="Facebook logo" className="h-5 w-5 mr-2" />
                        Facebook
                      </button>
                    </div>
                  </div>

                  {/* Password Reset */}
                  <div className="mt-8 text-center">
                    <form onSubmit={requestPasswordReset}>
                      <button
                        type="submit"
                        className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium hover:underline transition-colors"
                      >
                        Forgot your password?
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Face Login */}
              {activeTab === "face" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Face Recognition Login
                  </h3>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                    Position your face in the frame and take a clear photo for authentication
                  </p>

                  <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                    <Webcam
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      className="rounded-xl"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-indigo-500 rounded-xl pointer-events-none"></div>
                  </div>

                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 flex justify-center items-center mb-6"
                    onClick={capture}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take Photo
                  </button>

                  {imageSrc && (
                    <div className="animate-fadeIn">
                      <div className="relative mb-6 rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={imageSrc}
                          alt="Captured Face"
                          className="w-full rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-full p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <button
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex justify-center items-center"
                        onClick={handleFaceLogin}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Authenticate with Face
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-6 shadow-inner">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} SecureApp. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* Add custom styles */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SigninPage;