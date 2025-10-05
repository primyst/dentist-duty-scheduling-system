"use client";
import React, { useState } from "react";
import Header from "@/components/Header";
import ScheduleTable from "@/components/ScheduleTable";
import StatsPanel from "@/components/StatsPanel";
import StatusBar from "@/components/StatusBar";
import SwapModal from "@/components/SwapModal";

const dentists = ["Dr Abdulqudus", "Dr Usman", "Dr Kamal", "Dr Seun", "Dr Samuel, "Dr Ubaydah"];
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const shifts = ["Morning", "Afternoon"];
const MAX_SHIFTS = 3;

const requests: Record<string, string[]> = { "Dr Abdulqudus": ["Friday"] };

const AdminPanel = () => {
  const [schedule, setSchedule] = useState<Record<string, Record<string, string | null>>>(() => 
    dentists.reduce((acc,d) => ({...acc,[d]: days.reduce((a,day)=>({...a,[day]:null}),{})}), {})
  );
  const [conflicts, setConflicts] = useState<Record<string, Record<string, boolean>>>({});
  const [showModal, setShowModal] = useState(false);

  const autoAssign = () => {
    const newSchedule = JSON.parse(JSON.stringify(schedule));
    const shiftCounts: Record<string, number> = {};
    dentists.forEach(d=>shiftCounts[d]=0);
    const newConflicts: typeof conflicts = {};

    days.forEach(day => {
      shifts.forEach(shift => {
        const available = dentists.filter(d => shiftCounts[d]<MAX_SHIFTS && !requests[d]?.includes(day));
        if (!available.length) return;

        const minShifts = Math.min(...available.map(d=>shiftCounts[d]));
        const candidates = available.filter(d=>shiftCounts[d]===minShifts);
        const chosen = candidates[Math.floor(Math.random()*candidates.length)];

        if (Object.values(newSchedule[chosen]).includes(shift)) {
          if (!newConflicts[chosen]) newConflicts[chosen]={};
          newConflicts[chosen][day]=true;
        }

        newSchedule[chosen][day]=shift;
        shiftCounts[chosen]++;
      });
    });

    setSchedule(newSchedule);
    setConflicts(newConflicts);
  };

  const resetSchedule = () => setSchedule(dentists.reduce((acc,d) => ({...acc,[d]: days.reduce((a,day)=>({...a,[day]:null}),{})}), {}));

  const handleSwap = (from:string, to:string, day:string) => {
    const s = JSON.parse(JSON.stringify(schedule));
    [s[from][day],s[to][day]]=[s[to][day],s[from][day]];
    setSchedule(s);
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <div className="flex gap-2 mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={autoAssign}>Auto Assign</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={resetSchedule}>Reset</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={()=>setShowModal(true)}>Swap Shift</button>
        </div>
        <ScheduleTable dentists={dentists} days={days} schedule={schedule} conflicts={conflicts} />
        <StatsPanel schedule={schedule} />
        <StatusBar />
        <SwapModal show={showModal} onClose={()=>setShowModal(false)} dentists={dentists} onSwap={handleSwap} />
      </div>
    </div>
  );
};

export default AdminPanel;