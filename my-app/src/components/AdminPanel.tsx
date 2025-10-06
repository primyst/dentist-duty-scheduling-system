"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import ScheduleTable from "@/components/ScheduleTable";
import StatsPanel from "@/components/StatsPanel";
import StatusBar from "@/components/StatusBar";
import SwapModal from "@/components/SwapModal";
import NotificationPanel from "@/components/NotificationPanel";

const dentists = ["Dr Abdulqudus", "Dr Uthman", "Dr Kamal", "Dr Seun", "Dr Samuel", "Dr Akinwumi"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shifts = ["Morning", "Afternoon"];
const MAX_SHIFTS = 3;
const requests: Record<string, string[]> = { "Dr Abdulqudus": ["Friday"] };

const AdminPanel = () => {
  const [schedule, setSchedule] = useState<Record<string, Record<string, string | null>>>(() =>
    dentists.reduce(
      (acc, d) => ({ ...acc, [d]: days.reduce((a, day) => ({ ...a, [day]: null }), {}) }),
      {}
    )
  );

  const [conflicts, setConflicts] = useState<Record<string, Record<string, boolean>>>({});
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const autoAssign = () => {
    const newSchedule = JSON.parse(JSON.stringify(schedule));
    const shiftCounts: Record<string, number> = {};
    dentists.forEach((d) => (shiftCounts[d] = 0));
    const newConflicts: typeof conflicts = {};
    const newNotifs: string[] = [];

    days.forEach((day) => {
      shifts.forEach((shift) => {
        const available = dentists.filter(
          (d) => shiftCounts[d] < MAX_SHIFTS && !requests[d]?.includes(day)
        );
        if (!available.length) return;

        const minShifts = Math.min(...available.map((d) => shiftCounts[d]));
        const candidates = available.filter((d) => shiftCounts[d] === minShifts);
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];

        if (Object.values(newSchedule[chosen]).includes(shift)) {
          if (!newConflicts[chosen]) newConflicts[chosen] = {};
          newConflicts[chosen][day] = true;
        }

        newSchedule[chosen][day] = shift;
        shiftCounts[chosen]++;
      });
    });

    if (requests["Dr Abdulqudus"]?.includes("Friday"))
      newNotifs.push(
        "AI Suggestion: Dr Abdulqudus prefers to go to mosque on Friday — shift excluded."
      );

    if (Object.keys(newConflicts).length > 0)
      newNotifs.push("Warning: Some dentists have conflicting assignments.");

    setSchedule(newSchedule);
    setConflicts(newConflicts);
    setNotifications(newNotifs);
  };

  const resetSchedule = () => {
    setSchedule(
      dentists.reduce(
        (acc, d) => ({ ...acc, [d]: days.reduce((a, day) => ({ ...a, [day]: null }), {}) }),
        {}
      )
    );
    setConflicts({});
    setNotifications([]);
  };

  const handleSwap = (from: string, to: string, day: string) => {
    const s = JSON.parse(JSON.stringify(schedule));
    [s[from][day], s[to][day]] = [s[to][day], s[from][day]];
    setSchedule(s);
    setNotifications([`Shift on ${day} swapped between ${from} and ${to}`]);
  };

  const totalShifts = Object.values(schedule)
    .flatMap((d) => Object.values(d))
    .filter(Boolean).length;

  return (
    <div>
      <Header
        totalStaff={dentists.length}
        totalShifts={totalShifts}
        requests={Object.keys(requests).length}
      />

      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={autoAssign}
          >
            Auto Assign
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={resetSchedule}
          >
            Reset
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModal(true)}
          >
            Swap Shift
          </button>
        </div>

        <NotificationPanel messages={notifications} />

        {/* Side-by-side layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <ScheduleTable
              dentists={dentists}
              days={days}
              schedule={schedule}
              conflicts={conflicts}
            />
          </div>

          <div className="w-full lg:w-1/3">
            <StatsPanel schedule={schedule} />
          </div>
        </div>

        <StatusBar />

        <SwapModal
          show={showModal}
          onClose={() => setShowModal(false)}
          dentists={dentists}
          onSwap={handleSwap}
        />
      </div>
    </div>
  );
};

export default AdminPanel;