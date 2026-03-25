"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { menuLinks } from "./menuLinks";
import useAuthStore from "@/store/useAuthStore";

const AdminMenu = () => {
  const pathname = usePathname();
  const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const isSuperAdmin = user?.role == "SUPER_ADMIN"
  const isActive = (path) => pathname === path;
  const filterLinks = isSuperAdmin ? menuLinks.dashBoard : menuLinks.dashBoard.filter((item) => item.title !== "Admin Roles")

  return (
    <nav className="w-full h-screen p-4 overflow-y-auto custom-scrollbar">
      <ul className="adminMenuList flex-col flex gap-1 mb-20">
        {filterLinks.map((link) => {
          const Icon = link.icon;
          return (
            <li
              key={link.title}
              onClick={() => router.push(link.href)}
              className={`py-2 px-4 flex items-center rounded-lg mb-1 cursor-pointer hover:bg-slate-900 hover:text-white ${
                isActive(link.href)
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              <Icon className="inline-block mr-2" />
              <Link href={link.href}>{link.title}</Link>
            </li>
          );
        })}
        <p className="ml-4 text-stone-300 font-semibold  text-sm my-2">
          CAR LISTING
        </p>
        {menuLinks.listing.map((link) => {
          const Icon = link.icon;
          return (
            <li
              key={link.title}
              onClick={() => router.push(link.href)}
              className={`py-2 px-4 flex items-center rounded-lg cursor-pointer hover:bg-slate-900 hover:text-white ${isActive(link.href) ? "bg-black text-white" : "bg-white text-black"}`}
            >
              <Icon className="inline-block mr-2" />
              <Link href={link.href}>{link.title}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminMenu;
