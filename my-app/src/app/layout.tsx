import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Qudus Lautech Medical Duties Scheduling App",
  description: "Manage shifts for doctors and nurses, developed by Abdullateef Abdulqudus",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}