"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import AdminMenu from "@/components/template/adminMenu";
import Notifications from "@/components/template/Notifications";
import {
  FiMenu,
  FiX,
  FiBell,
  FiUser,
  FiLogOut,
  FiUserCheck,
} from "react-icons/fi";
import Image from "next/image";
import useAuthStore from "@/store/useAuthStore.js";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationOpen(false);
  };
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    logout(); // clear zustand
    router.replace("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <header className="sticky top-0 z-50 main-head py-2 px-3 md:px-7 shadow-md bg-white">
      <div className="flex justify-between items-center">

        {/* Logo */}
        <Link href="/">
          {/* <img src="/logo1.png" alt="Logo" className="logo-img" /> */}
          <Image
            src="/logo1.png"
            alt="Logo"
            width={20}
            height={20}
            className="logo-img"
          />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Notification Section */}
          <div className="relative mt-4">
            {/* notifications component handles fetching and UI */}
            <Notifications />
          </div>

          {/* Profile Section */}
          <div
            className="relative border border-black p-2 rounded-full"
            ref={profileRef}
          >
            <button
              onClick={toggleProfile}
              className="flex items-center text-gray-700 hover:text-black"
            >
              <FiUser className="w-5 h-5" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-50">
                <Link
                  href="/dashboard/adminProfile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                >
                  <FiUserCheck className="w-4 h-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-left"
                >
                  <FiLogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu (Mobile Only) */}
          <div className="md:hidden mt-4">
            <button
              className="text-gray-800 focus:outline-none"
              onClick={toggleMenu}
            >
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in Menu */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out md:hidden`}
      >
        <div className="bg-white w-64 h-full shadow-lg">
          <button
            className="text-gray-800 focus:outline-none p-4"
            onClick={toggleMenu}
          >
            <FiX className="w-6 h-6" />
          </button>
          <AdminMenu />
        </div>
      </div>
    </header>
  );
}