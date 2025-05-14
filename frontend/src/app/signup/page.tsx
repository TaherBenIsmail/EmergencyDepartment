"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

// User icon and loading spinner components
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 mx-auto text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// Form data type
interface FormDataState {
  name: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  image: File | null;
}

// API Response Type
interface ApiResponse {
  status: string;
  message: string;
  userId?: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    role: "patient",
    image: null,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  // Handle Input Change
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Selection with preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
    
    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Face Enrollment Function
  const enrollFace = async (userId: string): Promise<string | null> => {
    if (!formData.image) return null;

    const faceFormData = new FormData();
    faceFormData.append("image", formData.image);
    faceFormData.append("email", formData.email);

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:3000/user/enroll-face",
        faceFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("✅ Face Enrolled Successfully:", response.data);
      alert("✅ Face Enrolled Successfully!");

      return response.data.userId || null;
    } catch (error) {
      console.error("❌ Face Enrollment Failed:", error);
      alert("❌ Face Enrollment Failed!");
      return null;
    }
  };

  // Handle Signup Form Submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const userForm = new FormData();
    userForm.append("name", formData.name);
    userForm.append("lastname", formData.lastname);
    userForm.append("email", formData.email);
    userForm.append("password", formData.password);
    userForm.append("role", formData.role);
    userForm.append("creationDate", new Date().toISOString());
    if (formData.image) {
      userForm.append("image", formData.image);
    }

    try {
      const response = await axios.post<ApiResponse>(
        "http://localhost:3000/user/signup",
        userForm,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );

      console.log("✅ Signup Response:", response.data);

      if (response.data.status === "PENDING") {
        alert("Check your email for verification!");

        const faceToken = await enrollFace(response.data.userId!);
        if (faceToken) {
          alert("✅ Face successfully enrolled!");
        }

        router.push("/signin");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("❌ Signup Error:", error);
      alert("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Added mt-24 to create space between menu and signup card
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center mt-24">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col lg:flex-row bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
          {/* Left Side - Hero Image and Text */}
          <div className="lg:w-2/5 bg-indigo-600 p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500 opacity-20"></div>
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-400 opacity-20"></div>
            
            <div className="z-10">
              <div className="rounded-full bg-indigo-600 h-20 w-20 flex items-center justify-center mb-6">
                <UserIcon />
              </div>
              <h2 className="text-4xl font-bold text-white mb-6">Join Our Healthcare Platform</h2>
              <p className="text-blue-100 mb-8 text-lg">
                Create your account today and experience the future of personalized healthcare with advanced facial recognition.
              </p>
              <div className="flex space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-300"></div>
                <div className="h-2 w-2 rounded-full bg-blue-300"></div>
                <div className="h-2 w-2 rounded-full bg-blue-300"></div>
              </div>
            </div>
            
            <div className="text-blue-100 text-sm z-10">
              <p>Already have an account?</p>
              <Link href="/signin" className="text-white font-bold hover:underline">
                Sign in to your account →
              </Link>
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="lg:w-3/5 p-8 md:p-12 overflow-y-auto max-h-screen">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-extrabold text-gray-900">Create Your Account</h3>
              <p className="mt-2 text-gray-600">
                Please fill in all the details to get started
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150"
                        placeholder="John"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastname}
                        onChange={handleChange}
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base transition duration-150"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Role Selection */}
                <div className="mt-6">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I am a
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-lg shadow-sm transition duration-150"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h4>
                
                {/* Email */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-lg shadow-sm transition duration-150"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-3 text-base border border-gray-300 rounded-lg shadow-sm transition duration-150"
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Must be at least 8 characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              </div>

              {/* Profile Photo Section */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Profile Photo</h4>
                <p className="text-sm text-gray-600 mb-4">
                  This photo will be used for facial recognition login.
                </p>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0 h-28 w-28 rounded-full border-2 border-indigo-300 bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                    ) : (
                      <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition duration-300"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-indigo-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-indigo-500">PNG, JPG or GIF (MAX. 10MB)</p>
                      </div>
                      <input 
                        id="image-upload" 
                        name="image" 
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-700">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 transition duration-300"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Creating your account...
                    </>
                  ) : "Create Account"}
                </button>
              </div>
            </form>
            
            {/* Sign in link - Mobile only */}
            <div className="text-center mt-8 lg:hidden">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  href="/signin" 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;