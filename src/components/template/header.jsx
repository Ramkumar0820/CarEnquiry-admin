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

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <div className="relative mt-2">
            <Notifications />
          </div>

          {/* PROFILE */}
          <div
            className="relative"
            ref={profileRef}
          >
            <button
              onClick={toggleProfile}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FiUser className="w-5 h-5 text-gray-700" />
            </button>

            {/* DROPDOWN */}
            <div
              className={`absolute right-0 mt-2 w-44 bg-white border rounded-xl shadow-lg transition-all duration-200 ${
                profileOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 translate-y-2 invisible"
              }`}
            >
              <Link
                href="/dashboard/adminProfile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-t-xl"
              >
                <FiUserCheck className="w-4 h-4" />
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-left text-red-600 rounded-b-xl"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden mt-2">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div
          className={`bg-white w-64 h-full shadow-xl transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="p-4"
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