import "./globals.css";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "Qudus Lautech Medical Duties Scheduling App",
  description:
    "Manage shifts for doctors and nurses, developed by Abdullateef Abdulqudus",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/login";

  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">
          {!hideSidebar && (
            <aside className="hidden lg:block w-64 bg-white shadow-lg">
              <Sidebar />
            </aside>
          )}

          <div className="flex-1">
            {!hideSidebar && <Sidebar />}
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}