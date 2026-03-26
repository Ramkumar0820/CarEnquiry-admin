"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuLinks } from "./menuLinks";
import useAuthStore from "@/store/useAuthStore";

const AdminMenu = () => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const isActive = (path) => pathname === path;

  const filterLinks = isSuperAdmin
    ? menuLinks.dashBoard
    : menuLinks.dashBoard.filter(
        (item) => item.title !== "Admin Roles"
      );

  return (
    <nav className="w-full h-full p-4 overflow-y-auto custom-scrollbar bg-white/80 backdrop-blur-lg">
      
      <ul className="flex flex-col gap-2">

        {/* DASHBOARD LINKS */}
        {filterLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link key={link.title} href={link.href}>
              <li
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {/* LEFT ACTIVE INDICATOR */}
                <span
                  className={`w-1 h-6 rounded-full transition-all ${
                    active ? "bg-white" : "bg-transparent group-hover:bg-gray-400"
                  }`}
                />

                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{link.title}</span>
              </li>
            </Link>
          );
        })}

        {/* SECTION TITLE */}
        <p className="text-xs font-semibold text-gray-400 mt-6 mb-2 px-2 tracking-wider">
          CAR LISTING
        </p>

        {/* LISTING LINKS */}
        {menuLinks.listing.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);

          return (
            <Link key={link.title} href={link.href}>
              <li
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${
                  active
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`w-1 h-6 rounded-full transition-all ${
                    active ? "bg-white" : "bg-transparent group-hover:bg-gray-400"
                  }`}
                />

                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{link.title}</span>
              </li>
            </Link>
          );
        })}

      </ul>
    </nav>
  );
};

export default AdminMenu;
