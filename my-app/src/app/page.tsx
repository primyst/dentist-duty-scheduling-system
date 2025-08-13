"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validAdminIds, staff } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<"admin" | "staff" | null>(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    const token = uuidv4(); // generate unique token
    const expiration = new Date(Date.now() + 1 * 60 * 60 * 1000);

    if (selectedRole === "admin" && validAdminIds.includes(userId)) {
      document.cookie = `token=${token}; path=/; expires=${expiration.toUTCString()}`;
      document.cookie = `role=admin; path=/; expires=${expiration.toUTCString()}`;
      router.push("/dashboard");
      return;
    }

    if (selectedRole === "staff") {
      const matchedStaff = staff.find((s) => s.id === userId);

      if (matchedStaff) {
        document.cookie = `token=${token}; path=/; expires=${expiration.toUTCString()}`;
        document.cookie = `role=staff; path=/; expires=${expiration.toUTCString()}`;
        localStorage.setItem("staffInfo", JSON.stringify(matchedStaff));
        router.push("/staff");
      } else {
        setError("Invalid ID for selected role");
      }
    }
  };

  return (
    <main className="grid place-content-center place-items-center text-center w-full mx-auto lg:pl-24 px-4">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-800">
        Welcome to LAUTECH MedSchedule
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Please select your role and enter your ID to proceed.
      </p>

      <div className="grid gap-6 mb-6">
        <button
          className={`px-6 py-3 rounded-lg border ${
            selectedRole === "admin"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-600 border-blue-600"
          }`}
          onClick={() => setSelectedRole("admin")}
        >
          Admin
        </button>

        <button
          className={`px-6 py-3 rounded-lg border ${
            selectedRole === "staff"
              ? "bg-green-600 text-white"
              : "bg-white text-green-600 border-green-600"
          }`}
          onClick={() => setSelectedRole("staff")}
        >
          Staff
        </button>
      </div>

      {selectedRole && (
        <>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder={`Enter your ${selectedRole === "admin" ? "Admin" : "Staff"} ID`}
            className="px-4 py-2 border rounded w-64 mb-4"
          />
          <button
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-900"
            onClick={handleContinue}
          >
            Continue
          </button>
        </>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </main>
  );
}