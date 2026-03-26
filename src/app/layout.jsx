"use client";
import { Poppins } from "next/font/google";
import { usePathname } from 'next/navigation'; // Use next/navigation for server components
import "./globals.css";
import Header from "@/components/template/header";
import AdminMenu from "@/components/template/adminMenu";
import { Providers } from "./providers/providers";
import TawkProvider from "./providers/tawkMessenger/TawkProvider";

const inter = Poppins({ subsets: ["latin"], weight: ['100', '300', '700'], variable: '--poppins-font' });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // Get the current pathname
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          {/* {!isLoginPage && <TawkProvider />} */}
          {!isLoginPage && <Header />}
          <div className="flex">
            {!isLoginPage && (
              <div className="fixed w-72 bg-white shadow-md h-full hidden md:block">
                <AdminMenu />
              </div>
            )}
            <div className={`w-full h-full bg-white overflow-hidden ${!isLoginPage ? 'md:ml-72' : ''}`}>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
