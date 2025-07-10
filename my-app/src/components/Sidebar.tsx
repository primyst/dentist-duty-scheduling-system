// src/components/Sidebar.tsx

"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Admin Dashboard" },
  { href: "/staff", label: "My Schedule" },
  { href: "/requests", label: "Swap Requests" },
  { href: "/stats", label: "Stats" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => setOpen(!open);

  return (
    <>
      {/* Mobile: Hamburger Button */}
      <div className="lg:hidden flex justify-between items-center bg-gray-800 text-white px-6 py-4 w-full">
        <h1 className="text-lg font-bold">Lautech MedSchedule</h1>
        <button onClick={toggleSidebar}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar for Desktop and Slide-in for Mobile */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 space-y-4 z-50 transition-transform",
          "transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar header for mobile */}
        <div className="flex items-center gap-2 mb-4">
          <Image src="/lautech.png" width={40} height={40} alt="lautech logo" />
          <h1 className="font-bold uppercase text-xs md:text-sm lg:text-base">lautech medschedule</h1>
        </div>

        <nav>
          <ul className="space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    "block hover:underline",
                    pathname === link.href ? "font-bold underline" : ""
                  )}
                  onClick={() => setOpen(false)} // Close sidebar on link click
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      
      
    </>
  );
}
