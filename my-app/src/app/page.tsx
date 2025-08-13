"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [role, setRole] = useState<"admin" | "staff" | "">("");
  const [department, setDepartment] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (!role) return alert("Select a role first");

    localStorage.setItem("role", role);
    if (role === "staff") {
      if (!department) return alert("Select a department");
      localStorage.setItem("department", department);
      router.push("/my-shifts");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-2xl font-bold">Welcome to MedSchedule</h1>

      <select
        className="border px-4 py-2 rounded"
        value={role}
        onChange={(e) => setRole(e.target.value as "admin" | "staff" | "")}
      >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </select>

      {role === "staff" && (
        <select
          className="border px-4 py-2 rounded"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="Emergency">Emergency</option>
          <option value="Surgery">Surgery</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>
      )}

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleContinue}
      >
        Continue
      </button>
    </main>
  );
}