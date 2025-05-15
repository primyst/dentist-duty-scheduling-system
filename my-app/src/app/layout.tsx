import "./globals.css";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Scheduling App",
  description: "Manage shifts for doctors and nurses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-gray-100">
          <Navbar />
          <div className="max-w-5xl w-full mx-auto">{children}</div>
        </div>
      </body>
    </html>
  );
}