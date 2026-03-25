import { FaHome, FaCar, FaPlus, FaList } from "react-icons/fa";
import { IoIosColorPalette } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import { SiRollsroyce } from "react-icons/si";
import { BiSolidUserAccount } from "react-icons/bi";
import { FaUserCog } from "react-icons/fa";
import { GiCarDoor } from "react-icons/gi";
import { AiOutlineSafety } from "react-icons/ai";

export const menuLinks = {
  dashBoard: [
    {
      title: "Dashboard",
      href: "/",
      icon: FaHome,
    },
    // {
    //   title: "Admin Profile",
    //   href: "/dashboard/adminProfile",
    //   icon: BiSolidUserAccount,
    // },
    {
      title: "Admin Roles",
      href: "/dashboard/adminRoles",
      icon: FaUserCog,
    },
    {
      title: "Inquiry",
      href: "/dashboard/inquiry",
      icon: FaBell,
    },
  ],
  listing: [
    {
      title: "Car Listings",
      href: "/dashboard/listing",
      icon: FaCar,
    },
    {
      title: "New Listing",
      href: "/dashboard/listing/new",
      icon: FaPlus,
    },
    {
      title: "Make",
      href: "/dashboard/listing/make",
      icon: SiRollsroyce,
    },
    {
      title: "Model",
      href: "/dashboard/listing/model",
      icon: FaList,
    },
    {
      title: "Color",
      href: "/dashboard/listing/color",
      icon: IoIosColorPalette,
    },
    {
      title: "Features",
      href: "/dashboard/listing/features",
      icon: GiCarDoor,
    },
    {
      title: "Safety Features",
      href: "/dashboard/listing/safety-features",
      icon: AiOutlineSafety,
    },
    {
      title: "Type",
      href: "/dashboard/listing/type",
      icon: FaList,
    },
  ],
};
