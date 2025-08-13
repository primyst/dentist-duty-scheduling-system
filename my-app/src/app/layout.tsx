import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lautech MedSchedule",
  description: "Medical Duty Scheduling App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
