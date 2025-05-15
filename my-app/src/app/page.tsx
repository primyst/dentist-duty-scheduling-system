"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { isValidAdminId, isValidStaffId } from "@/lib/data";

export default function HomePage() {

const [selectedRole, setSelectedRole] = useState<"admin" | "staff" | null>(

null

);

const [userId, setUserId] = useState("");

const [error, setError] = useState("");

const router = useRouter();

const handleContinue = () => {

const isValid =

  (selectedRole === "admin" && isValidAdminId(userId)) ||

  (selectedRole === "staff" && isValidStaffId(userId));



if (isValid) {

  // Store role and id in localStorage instead of JWT

  localStorage.setItem(

    "user",

    JSON.stringify({ id: userId, role: selectedRole })

  );

  setError("");

  router.push(selectedRole === "admin" ? "/dashboard" : "/staff");

} else {

  setError("Invalid ID for selected role.");

}

};

return (

<main className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-100">

  <h1 className="text-4xl font-bold mb-6 text-gray-800">

    Welcome to Lautech MedSchedule

  </h1>

  <p className="text-lg text-gray-600 max-w-xl mb-6">

    Please select your role and enter your ID to proceed.

  </p>



  <div className="flex flex-col sm:flex-row gap-6 mb-6">

    <button

      className={`px-6 py-3 rounded-lg border ${

        selectedRole === "admin"

          ? "bg-blue-600 text-white"

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

        placeholder={`Enter your ${selectedRole} ID`}

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

