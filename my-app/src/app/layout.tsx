import "./globals.css";
import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Qudus Lautech Medical Duties Scheduling App",
  description:
    "Manage shifts for doctors and nurses, developed by Abdullateef Abdulqudus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}