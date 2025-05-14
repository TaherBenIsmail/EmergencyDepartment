"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProfile() {
  const [user, setUser] = useState({ name: "", email: "", image: "" });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/session", {
          withCredentials: true, // ✅ Ensures cookies are sent for session-based authentication
        });

        console.log("✅ User session data:", response.data);

        if (response.data.status === "SUCCESS") {
          setUser(response.data.user);
        } else {
          console.log("⚠️ No active session.");
          router.push("/signin");
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        router.push("/signin");
      }
    };

    fetchUser();
  }, [router]);

  // Create preview URL when new image is selected
  useEffect(() => {
    if (newImage) {
      const objectUrl = URL.createObjectURL(newImage);
      setPreviewUrl(objectUrl);

      // Clean up the URL when component unmounts
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [newImage]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    if (newImage) formData.append("image", newImage);

    try {
      const response = await axios.put("http://localhost:3000/user/edit-profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "SUCCESS") {
        // Show success notification
        const notification = document.getElementById("notification");
        notification.classList.remove("opacity-0");
        notification.classList.add("opacity-100");
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          notification.classList.remove("opacity-100");
          notification.classList.add("opacity-0");
          
          // Navigate after notification hides
          setTimeout(() => {
            window.dispatchEvent(new Event("storage")); // Notify Header to refresh
            router.push("/");
          }, 500);
        }, 3000);
      } else {
        alert("❌ Failed to update profile.");
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Update failed:", error);
      alert("❌ Failed to update profile");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-gradient-to-b from-gray-800 to-gray-900 text-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Edit Your Profile
      </h1>

      {/* Success Notification */}
      <div 
        id="notification" 
        className="fixed top-6 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-500 opacity-0 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Profile updated successfully!
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-4">
          <div className="group relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg hover:border-purple-500 transition-all duration-300">
            <Image
              src={previewUrl || (user.image ? `/images/${user.image}` : "/images/default-avatar.png")}
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full transition-all duration-300 group-hover:scale-110"
            />
          </div>
          
          <label className="relative block cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-2 px-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-center overflow-hidden">
            <span className="relative z-10">Choose New Photo</span>
            <input
              type="file"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
              accept="image/*"
            />
          </label>
          
          {newImage && (
            <p className="text-sm text-gray-300 italic">
              New photo selected: {newImage.name}
            </p>
          )}
        </div>

        {/* Name Field */}
        <div className="group relative border-b-2 border-gray-600 focus-within:border-blue-500 transition-all duration-300">
          <label className="absolute -top-5 left-0 text-sm font-medium text-gray-400 group-focus-within:text-blue-400 transition-all duration-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full py-3 bg-transparent text-white focus:outline-none placeholder-gray-500"
            placeholder="Enter your name"
          />
        </div>

        {/* Email Field */}
        <div className="group relative border-b-2 border-gray-600 transition-all duration-300">
          <label className="absolute -top-5 left-0 text-sm font-medium text-gray-400 transition-all duration-300">
            Email (Cannot be changed)
          </label>
          <input
            type="email"
            name="email"
            value={user.email}
            className="w-full py-3 bg-transparent text-gray-400 focus:outline-none"
            disabled
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-8 py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
            ${loading 
              ? "bg-gray-600 cursor-not-allowed" 
              : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"}
          `}
        >
          <div className="flex items-center justify-center">
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes
              </>
            ) : (
              "Save Changes"
            )}
          </div>
        </button>
      </form>
    </div>
  );
}