"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/requests", label: "Swap Requests" },
  { href: "/stats", label: "Stats" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const signOut = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("department");
    router.push("/");
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <span className="font-semibold">Lautech MedSchedule (Admin)</span>
        <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 z-50 transition-transform transform",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <nav className="mt-10 space-y-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={clsx(
                "block px-2 py-1 rounded hover:bg-gray-700",
                pathname === l.href && "bg-gray-700 font-semibold"
              )}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={signOut}
            className="mt-6 w-full text-left px-2 py-1 rounded bg-red-600 hover:bg-red-700"
          >
            Sign out
          </button>
        </nav>
      </aside>
    </>
  );
}
