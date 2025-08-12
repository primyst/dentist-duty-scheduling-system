"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/";

  return (
    <div className="flex">
      {!isLoginPage && <Sidebar />}
      <main className={isLoginPage ? "w-full" : "flex-1 ml-64"}>
        {children}
      </main>
    </div>
  );
}