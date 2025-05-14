"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ThemeToggler from "./ThemeToggler";
import menuData from "./menuData";
import axios from "axios";

const Header = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Handle Sticky Navbar on Scroll
  useEffect(() => {
    const handleStickyNavbar = () => {
      setSticky(window.scrollY >= 80);
    };
    window.addEventListener("scroll", handleStickyNavbar);
    return () => {
      window.removeEventListener("scroll", handleStickyNavbar);
    };
  }, []);

  const fetchUserSession = useCallback(async () => {
    try {
      console.log("🔄 Fetching user session...");
  
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/user/session", {
headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
  
      if (response.data.status === "SUCCESS" && response.data.user) {
        console.log("✅ User session found:", response.data.user);
        setUser(response.data.user);
      } else {
        console.log("⚠️ No active user session.");
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        // Only show non-401 errors
        console.error("❌ Failed to fetch session:", error);
      }
      // Silent fail for 401 unauthorized errors
    }
  }, [setUser]);
  
  useEffect(() => {
    fetchUserSession();
  
    // Event listener for forcing user refresh
    const handleRefresh = () => fetchUserSession();
    window.addEventListener("refresh-user", handleRefresh);
    window.addEventListener("storage", handleRefresh);
  
    return () => {
      window.removeEventListener("refresh-user", handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, [fetchUserSession]);

  const handleLogout = async () => {
    try {
      // Request to logout on the backend
      await axios.get("http://localhost:3000/user/logout", { withCredentials: true });

const clearCookie = (name) => {
  document.cookie = `${name}=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

      
      clearCookie("token_3001");
      clearCookie("token_3002");
      clearCookie("connect.sid");

      // Remove token from storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");

      // Reset user state and redirect
      setUser(null);
      router.push("/signin");
    } catch (error) {
      console.error("❌ Logout Failed:", error);
    }
  };

  // Handle mobile menu toggle
  const toggleNavbar = () => setNavbarOpen(!navbarOpen);

  return (
    <header
      className={`header left-0 top-0 z-40 w-full ${
        sticky
          ? "fixed z-[9999] bg-white bg-opacity-80 shadow-md backdrop-blur-sm transition dark:bg-gray-900 dark:shadow-gray-800"
          : "absolute bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
     <Link href="/" className={`header-logo block w-full ${sticky ? "py-5 lg:py-2" : "py-8"} `}>
            <div dangerouslySetInnerHTML={{ __html:
            `<svg width="138" height="27" viewBox="0 0 138 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="20" font-family="Segoe UI, sans-serif" font-size="20" font-weight="bold" fill="#0F172A">
            AI <tspan fill="#10B981">Doctor</tspan>
            </text>
            <circle cx="125" cy="13.5" r="5" fill="#10B981" />
            <path d="M122 13.5h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path d="M125 10.5v6" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>` }} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleNavbar}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500 lg:hidden"
            aria-expanded={navbarOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`${navbarOpen ? "hidden" : "block"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              className={`${navbarOpen ? "block" : "hidden"} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <ul className="flex space-x-8">
              {menuData.map((menuItem, index) => (
                <li key={index} className="relative">
                  {menuItem.path ? (
                    <Link
                      href={menuItem.path}
                      className={`text-base font-medium transition-colors ${
                        pathname === menuItem.path
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-700 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400"
                      }`}
                    >
                      {menuItem.title}
                    </Link>
                  ) : (
                    <span className="cursor-pointer text-base font-medium text-gray-700 transition-colors hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400">
                      {menuItem.title}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* User Actions Section */}
          <div className="flex items-center space-x-4">
            {user && user.role !== "admin" ? (
              <>
                {/* Profile Avatar */}
                <div 
                  className="relative cursor-pointer rounded-full overflow-hidden ring-2 ring-teal-500 transition hover:ring-offset-2"
                  onClick={() => router.push("/edit-profile")}
                >
                  <Image
src={
  user.role === 'doctor'
    ? `http://localhost:3002/images/${user.image || "default-avatar.png"}`
    : `/images/${user.image || "default-avatar.png"}`
}

                    alt="User avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="rounded-md border-2 border-teal-500 bg-white px-4 py-2 text-sm font-medium text-teal-500 transition duration-150 ease-in-out hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin"
                  className="text-sm font-medium text-gray-700 hover:text-teal-600 dark:text-gray-200 dark:hover:text-teal-400"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-teal-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Theme Toggler */}
            <ThemeToggler />
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        <div
          className={`lg:hidden ${
            navbarOpen ? "block" : "hidden"
          } absolute left-0 right-0 top-20 z-30 rounded-b-lg border-t border-gray-200 bg-white px-2 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900`}
        >
          <ul className="space-y-1">
            {menuData.map((menuItem, index) => (
              <li key={index}>
                {menuItem.path ? (
                  <Link
                    href={menuItem.path}
                    className={`block rounded-md px-3 py-2 text-base font-medium ${
                      pathname === menuItem.path
                        ? "bg-teal-50 text-teal-600 dark:bg-gray-800 dark:text-teal-400"
                        : "text-gray-700 hover:bg-gray-50 hover:text-teal-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-teal-400"
                    }`}
                    onClick={() => setNavbarOpen(false)}
                  >
                    {menuItem.title}
                  </Link>
                ) : (
                  <span className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-teal-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-teal-400">
                    {menuItem.title}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;