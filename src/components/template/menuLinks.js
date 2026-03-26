import {
  LayoutDashboard,
  ShieldCheck,
  Mail,
  Phone,
  Car,
  PlusCircle,
  List,
  Palette,
  DoorOpen,
  Shield,
  Layers,
  CarFront
} from "lucide-react";

export const menuLinks = {
  dashBoard: [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Admin Roles",
      href: "/dashboard/adminRoles",
      icon: ShieldCheck,
    },
    {
      title: "Inquiry",
      href: "/dashboard/inquiry",
      icon: Mail,
    },
    {
      title: "Contact Inquiry",
      href: "/dashboard/contact-inquiry",
      icon: Phone,
    },
  ],

  listing: [
    {
      title: "Car Listings",
      href: "/dashboard/listing",
      icon: Car,
    },
    {
      title: "New Listing",
      href: "/dashboard/listing/new",
      icon: PlusCircle,
    },
    {
      title: "Make",
      href: "/dashboard/listing/make",
      icon: CarFront, // brand/manufacturer feel
    },
    {
      title: "Model",
      href: "/dashboard/listing/model",
      icon: Layers,
    },
    {
      title: "Color",
      href: "/dashboard/listing/color",
      icon: Palette,
    },
    {
      title: "Features",
      href: "/dashboard/listing/features",
      icon: DoorOpen,
    },
    {
      title: "Safety Features",
      href: "/dashboard/listing/safety-features",
      icon: Shield,
    },
    {
      title: "Type",
      href: "/dashboard/listing/type",
      icon: List,
    },
  ],
};