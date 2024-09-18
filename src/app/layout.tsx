"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader/FullPage";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/firebase";

const publicRoutes = ["/auth/signin"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      const currentPath = window.location.pathname;
      if (!currentUser && !publicRoutes.includes(currentPath)) {
        router.push("/auth/signin");
      } else if (currentUser && publicRoutes.includes(currentPath)) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Toaster />
        {loading ? <Loader /> : children}
      </body>
    </html>
  );
}
