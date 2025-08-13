"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.replace("/");
    } else {
      setOk(true);
    }
  }, [router]);

  if (!ok) return null;

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 pt-14 lg:pt-0 lg:ml-64 p-4">{children}</main>
    </div>
  );
}
