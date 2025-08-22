"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { staff, validAdminIds } from "@/lib/data";

export default function HomePage() {
  const [role, setRole] = useState<"" | "admin" | "staff">("");
  const [department, setDepartment] = useState("");
  const [passkey, setPasskey] = useState("");
  const router = useRouter();

  const go = () => {
    if (!role) return alert("Select a role");
    if (!passkey) return alert("Enter your ID / Passkey");

    if (role === "staff") {
      if (!department) return alert("Select a department");

      const staffExists = staff.find(
        (s) => s.id === passkey && s.department === department
      );
      if (!staffExists) return alert("Invalid staff ID for this department");

      localStorage.setItem("role", "staff");
      localStorage.setItem("department", department);
      localStorage.setItem("staffId", passkey);
      router.push("/staff");
    } else {
      // admin
      if (!validAdminIds.includes(passkey)) return alert("Invalid admin ID");

      localStorage.setItem("role", "admin");
      localStorage.setItem("adminId", passkey);
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-screen w-full grid place-content-center gap-4 px-4">
      <h1 className="text-2xl font-bold text-center">
        Welcome to Lautech MedSchedule
      </h1>

      <select
        className="border px-3 py-2 rounded w-64"
        value={role}
        onChange={(e) => setRole(e.target.value as "" | "admin" | "staff")}
      >
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
      </select>

      {role === "staff" && (
        <select
          className="border px-3 py-2 rounded w-64"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="Emergency">Emergency</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Surgery">Surgery</option>
          <option value="Maternity">Maternity</option>
          <option value="Radiology">Radiology</option>
        </select>
      )}

      {role && (
        <input
          type="text"
          className="border px-3 py-2 rounded w-64"
          placeholder="Enter your ID e.g. emerdoc001"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
        />
      )}

      <button
        onClick={go}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </main>
  );
}