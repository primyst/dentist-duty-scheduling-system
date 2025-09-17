"use client";

import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Calendar,
  Users,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Clock,
  ArrowRightLeft,
  Bell,
  ChevronRight,
  ChevronLeft,
  UserCheck,
} from "lucide-react";

/* ---------- Data ---------- */

const initialDentists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    maxWeeklyShifts: 5,
    availability: {
      monday: ["morning", "afternoon"],
      tuesday: ["morning", "afternoon"],
      wednesday: ["morning"],
      thursday: ["afternoon"],
      friday: ["morning", "afternoon"],
      saturday: ["morning"],
      sunday: [],
    },
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    maxWeeklyShifts: 4,
    availability: {
      monday: ["afternoon"],
      tuesday: ["morning", "afternoon"],
      wednesday: ["morning", "afternoon"],
      thursday: ["morning", "afternoon"],
      friday: ["morning"],
      saturday: [],
      sunday: ["morning"],
    },
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    maxWeeklyShifts: 6,
    availability: {
      monday: ["morning", "afternoon"],
      tuesday: ["morning"],
      wednesday: ["afternoon"],
      thursday: ["morning", "afternoon"],
      friday: ["afternoon"],
      saturday: ["morning", "afternoon"],
      sunday: ["afternoon"],
    },
  },
  {
    id: 4,
    name: "Dr. David Williams",
    maxWeeklyShifts: 3,
    availability: {
      monday: ["morning"],
      tuesday: ["afternoon"],
      wednesday: ["morning", "afternoon"],
      thursday: ["morning"],
      friday: [],
      saturday: ["afternoon"],
      sunday: ["morning", "afternoon"],
    },
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    maxWeeklyShifts: 5,
    availability: {
      monday: ["afternoon"],
      tuesday: ["morning", "afternoon"],
      wednesday: ["morning"],
      thursday: ["afternoon"],
      friday: ["morning", "afternoon"],
      saturday: ["morning"],
      sunday: ["morning"],
    },
  },
];

/* keep days/shifts readonly but use spread copies when we need mutable lists */
const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
type Day = (typeof daysOfWeek)[number];

const shifts = ["morning", "afternoon"] as const;
type Shift = (typeof shifts)[number];

/* ---------- Types ---------- */

type ScheduleAssignment = {
  dentistId: number;
  dentistName: string;
  assigned: true;
  day: Day;
  shift: Shift;
};

type SwapRequest = {
  id: number;
  type: "swap" | "release";
  fromDentist: number;
  day: Day;
  shift: Shift;
  toDentist?: number | null;
  targetDay?: Day | null;
  targetShift?: Shift | null;
  timestamp: string; // ISO string
  status: "pending" | "approved" | "rejected";
  fromDentistName?: string;
  toDentistName?: string | null;
};

type Conflict = {
  id: string;
  message: string;
  dentistId?: number;
  day?: Day;
  shift?: Shift;
  type: string;
};

type ScheduleMap = Record<
  number,
  Record<Day, Record<Shift, ScheduleAssignment | null>>
>;

type ScheduleState = {
  schedule: ScheduleMap;
  swapRequests: SwapRequest[];
  conflicts: Conflict[];
};

type Action =
  | { type: "SET_SCHEDULE"; payload: ScheduleMap }
  | { type: "ADD_SWAP_REQUEST"; payload: SwapRequest }
  | { type: "APPROVE_SWAP"; payload: number } // request id
  | { type: "REJECT_SWAP"; payload: number } // request id
  | { type: "CLEAR_CONFLICTS" }
  | { type: "SET_CONFLICTS"; payload: Conflict[] };

/* ---------- Reducer ---------- */

const scheduleReducer = (state: ScheduleState, action: Action): ScheduleState => {
  switch (action.type) {
    case "SET_SCHEDULE":
      return { ...state, schedule: action.payload };
    case "ADD_SWAP_REQUEST":
      return {
        ...state,
        swapRequests: [...state.swapRequests, action.payload],
      };
    case "APPROVE_SWAP": {
      const approvedSwap = state.swapRequests.find((r) => r.id === action.payload);
      if (!approvedSwap) return state;

      // Create a deep-ish copy of schedule for mutation
      const newSchedule: ScheduleMap = JSON.parse(JSON.stringify(state.schedule));

      if (approvedSwap.type === "swap") {
        const fromDentist = approvedSwap.fromDentist;
        const toDentist = approvedSwap.toDentist!;
        const { day, shift, targetDay, targetShift } = approvedSwap;

        const fromSlot =
          newSchedule[fromDentist]?.[day]?.[shift] ?? null;

        const toSlot =
          newSchedule[toDentist]?.[targetDay ?? day]?.[targetShift ?? shift] ??
          null;

        // swap (safe assignment)
        if (newSchedule[fromDentist] && newSchedule[fromDentist][day]) {
          newSchedule[fromDentist][day][shift] = toSlot;
        }
        if (newSchedule[toDentist] && newSchedule[toDentist][targetDay ?? day]) {
          newSchedule[toDentist][targetDay ?? day][targetShift ?? shift] = fromSlot;
        }
      } else if (approvedSwap.type === "release") {
        const fromDentist = approvedSwap.fromDentist;
        const { day, shift } = approvedSwap;
        if (newSchedule[fromDentist] && newSchedule[fromDentist][day]) {
          newSchedule[fromDentist][day][shift] = null;
        }
      }

      return {
        ...state,
        schedule: newSchedule,
        swapRequests: state.swapRequests.filter((r) => r.id !== action.payload),
      };
    }
    case "REJECT_SWAP":
      return {
        ...state,
        swapRequests: state.swapRequests.filter((r) => r.id !== action.payload),
      };
    case "CLEAR_CONFLICTS":
      return { ...state, conflicts: [] };
    case "SET_CONFLICTS":
      return { ...state, conflicts: action.payload };
    default:
      return state;
  }
};

/* ---------- Component ---------- */

const DentistDutiesScheduler: React.FC = () => {
  const [dentists] = useState(() => initialDentists);
  const [selectedWeek, setSelectedWeek] = useState<Date>(() => new Date());
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    dentistId: number;
    day: Day;
    shift: Shift;
  } | null>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);

  const [swapTargetDentist, setSwapTargetDentist] = useState<string>("");
  const [swapTargetDay, setSwapTargetDay] = useState<string>("");
  const [swapTargetShift, setSwapTargetShift] = useState<string>("");

  const [state, dispatch] = useReducer(scheduleReducer, {
    schedule: {},
    swapRequests: [],
    conflicts: [],
  } as ScheduleState);

  /* ---------- Helpers ---------- */

  const makeEmptySchedule = (): ScheduleMap => {
    const map: ScheduleMap = {};
    dentists.forEach((d) => {
      map[d.id] = {} as Record<Day, Record<Shift, ScheduleAssignment | null>>;
      // use a mutable copy of readonly tuple
      [...daysOfWeek].forEach((day: Day) => {
        map[d.id][day] = { morning: null, afternoon: null };
      });
    });
    return map;
  };

  // Build conflicts from a schedule (pure)
  const computeConflicts = (schedule: ScheduleMap): Conflict[] => {
    const conflicts: Conflict[] = [];

    // same-day conflicts: dentist assigned both shifts in same day
    (Object.keys(schedule) as string[]).forEach((dentistIdStr) => {
      const dentistId = Number(dentistIdStr);
      [...daysOfWeek].forEach((day: Day) => {
        const morning = schedule[dentistId]?.[day]?.morning;
        const afternoon = schedule[dentistId]?.[day]?.afternoon;
        if (morning && afternoon) {
          conflicts.push({
            id: `conflict-${dentistId}-${day}`,
            message: `${dentists.find((d) => d.id === dentistId)?.name || "Dentist"} has conflicting shifts on ${day}`,
            dentistId,
            day,
            type: "same-day-conflict",
          });
        }
      });
    });

    // uncovered shifts (if any shift has no dentist assigned at all)
    [...daysOfWeek].forEach((day: Day) => {
      [...shifts].forEach((shift: Shift) => {
        const assignedAny = (Object.keys(schedule) as string[]).some((dIdStr) => {
          const dId = Number(dIdStr);
          return !!schedule[dId]?.[day]?.[shift];
        });
        if (!assignedAny) {
          conflicts.push({
            id: `uncovered-${day}-${shift}`,
            message: `No coverage for ${shift} shift on ${day}`,
            day,
            shift,
            type: "no-coverage",
          });
        }
      });
    });

    return conflicts;
  };

  // Fair per-shift assignment algorithm
  const autoAssignShifts = useCallback(() => {
    const schedule = makeEmptySchedule();
    const assignedCounts: Record<number, number> = {};
    dentists.forEach((d) => (assignedCounts[d.id] = 0));

    // For each day and each shift, pick best dentist
    [...daysOfWeek].forEach((day: Day) => {
      [...shifts].forEach((shift: Shift) => {
        const candidates = dentists
          .filter((d) => d.availability[day]?.includes(shift))
          .filter((d) => assignedCounts[d.id] < d.maxWeeklyShifts)
          .filter((d) => {
            const otherShift: Shift = shift === "morning" ? "afternoon" : "morning";
            return !schedule[d.id][day][otherShift];
          });

        if (candidates.length === 0) {
          return;
        }

        // pick candidate with smallest assigned count
        candidates.sort((a, b) => {
          const ca = assignedCounts[a.id];
          const cb = assignedCounts[b.id];
          return ca !== cb ? ca - cb : a.id - b.id;
        });

        const pick = candidates[0];
        schedule[pick.id][day][shift] = {
          dentistId: pick.id,
          dentistName: pick.name,
          assigned: true,
          day,
          shift,
        };
        assignedCounts[pick.id] += 1;
      });
    });

    const conflicts = computeConflicts(schedule);

    dispatch({ type: "SET_SCHEDULE", payload: schedule });
    dispatch({ type: "SET_CONFLICTS", payload: conflicts });
  }, [dentists]);

  // run once on mount
  useEffect(() => {
    autoAssignShifts();
  }, [autoAssignShifts]);

  // recompute conflicts whenever schedule changes (deterministic, avoids setTimeout hacks)
  useEffect(() => {
    if (state.schedule && Object.keys(state.schedule).length > 0) {
      const newConflicts = computeConflicts(state.schedule);
      dispatch({ type: "SET_CONFLICTS", payload: newConflicts });
    }
  }, [state.schedule]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellClick = (dentistId: number, day: Day, shift: Shift) => {
    if (!isAdmin) {
      const assigned = !!state.schedule?.[dentistId]?.[day]?.[shift];
      if (!assigned) return;
      setSelectedCell({ dentistId, day, shift });
      setShowSwapModal(true);
    }
  };

  // Requesting swap/release (dentist action)
  const requestSwap = (
    type: "swap" | "release",
    targetDentist: number | null = null,
    targetDay: Day | null = null,
    targetShift: Shift | null = null
  ) => {
    if (!selectedCell) return;

    const swapRequest: SwapRequest = {
      id: Date.now(),
      type,
      fromDentist: selectedCell.dentistId,
      day: selectedCell.day,
      shift: selectedCell.shift,
      toDentist: targetDentist,
      targetDay,
      targetShift,
      timestamp: new Date().toISOString(),
      status: "pending",
      fromDentistName: dentists.find((d) => d.id === selectedCell.dentistId)?.name,
      toDentistName: targetDentist ? dentists.find((d) => d.id === targetDentist)?.name ?? null : null,
    };

    dispatch({ type: "ADD_SWAP_REQUEST", payload: swapRequest });
    setShowSwapModal(false);
    setSelectedCell(null);
    setSwapTargetDentist("");
    setSwapTargetDay("");
    setSwapTargetShift("");
    setShowAdminPanel(true);
  };

  // Admin approves a request: just dispatch; conflict recompute happens via the effect on schedule
  const approveSwap = (requestId: number) => {
    dispatch({ type: "APPROVE_SWAP", payload: requestId });
  };

  const rejectSwap = (requestId: number) => {
    dispatch({ type: "REJECT_SWAP", payload: requestId });
  };

  // count assigned shifts for display
  const getDentistShiftCount = (dentistId: number) => {
    let count = 0;
    const scheduleForDentist = state.schedule?.[dentistId];
    if (!scheduleForDentist) return 0;
    [...daysOfWeek].forEach((day: Day) => {
      [...shifts].forEach((shift: Shift) => {
        if (scheduleForDentist[day]?.[shift]) count++;
      });
    });
    return count;
  };

  // week helpers
  const navigateWeek = (direction: number) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + direction * 7);
    setSelectedWeek(newDate);
  };

  const getWeekRange = () => {
    const startOfWeek = new Date(selectedWeek);
    startOfWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { start: startOfWeek, end: endOfWeek };
  };

  const getShiftInfo = (dentistId: number, day: Day, shift: Shift) => {
    const assignment = state.schedule?.[dentistId]?.[day]?.[shift];
    if (assignment) {
      return { assigned: true, dentistName: assignment.dentistName, isAvailable: true };
    }
    const dentist = dentists.find((d) => d.id === dentistId);
    const isAvailable = dentist?.availability[day]?.includes(shift) ?? false;
    return { assigned: false, dentistName: null, isAvailable };
  };

  const getCellStyling = (dentistId: number, day: Day, shift: Shift) => {
    const shiftInfo = getShiftInfo(dentistId, day, shift);
    const hasConflict = state.conflicts.some((c) => c.dentistId === dentistId && c.day === day);
    if (hasConflict) return "bg-red-100 border-red-300 text-red-800";
    if (shiftInfo.assigned) return shift === "morning"
      ? "bg-blue-100 border-blue-300 text-blue-800"
      : "bg-green-100 border-green-300 text-green-800";
    if (shiftInfo.isAvailable) return "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100";
    return "bg-gray-200 border-gray-300 text-gray-400";
  };

  const exportToCSV = () => {
    const csvData: string[][] = [];
    csvData.push(["Dentist", ...[...daysOfWeek].map((d) => `${d} Morning`), ...[...daysOfWeek].map((d) => `${d} Afternoon`)]);
    dentists.forEach((dentist) => {
      const row: string[] = [dentist.name];
      [...daysOfWeek].forEach((day: Day) => {
        const morningShift = getShiftInfo(dentist.id, day, "morning");
        row.push(morningShift.assigned ? "Assigned" : (morningShift.isAvailable ? "Available" : "Not Available"));
      });
      [...daysOfWeek].forEach((day: Day) => {
        const afternoonShift = getShiftInfo(dentist.id, day, "afternoon");
        row.push(afternoonShift.assigned ? "Assigned" : (afternoonShift.isAvailable ? "Available" : "Not Available"));
      });
      csvData.push(row);
    });

    const csvContent = csvData.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dentist-schedule.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  /* ---------- JSX (unchanged visual structure) ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dentist Duties Scheduler</h1>
              <p className="text-sm text-gray-500">Automated shift scheduling with conflict management</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsAdmin(true)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${isAdmin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}
              >
                <UserCheck className="w-4 h-4 inline mr-1" />
                Admin
              </button>
              <button
                onClick={() => setIsAdmin(false)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${!isAdmin ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Dentist
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowAdminPanel(true)} className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6 text-gray-600" />
                {state.swapRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {state.swapRequests.length}
                  </span>
                )}
              </button>
            </div>

            <button onClick={autoAssignShifts} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Auto Assign</span>
            </button>

            <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Status Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded" />
                <span className="text-sm text-gray-600">Morning Shift</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                <span className="text-sm text-gray-600">Afternoon Shift</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                <span className="text-sm text-gray-600">Conflict</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded" />
                <span className="text-sm text-gray-600">Not Available</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {state.conflicts.length > 0 && (
                <div className="flex items-center space-x-2 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{state.conflicts.length} Conflicts</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button onClick={() => navigateWeek(-1)} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <Clock className="w-4 h-4" />
                <span>
                  {getWeekRange().start.toLocaleDateString()} - {getWeekRange().end.toLocaleDateString()}
                </span>
                <button onClick={() => navigateWeek(1)} className="p-1 hover:bg-gray-100 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-64">Dentist</th>
                  {daysOfWeek.map((day) => (
                    <th key={day} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 min-w-32">
                      <div className="capitalize">{day}</div>
                      <div className="text-xs text-gray-500 font-normal mt-1">M / A</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dentists.map((dentist) => (
                  <tr key={dentist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {dentist.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{dentist.name}</div>
                            <div className="text-sm text-gray-500">Max: {dentist.maxWeeklyShifts} shifts/week</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {getDentistShiftCount(dentist.id)}/{dentist.maxWeeklyShifts}
                          </div>
                          <div className="text-xs text-gray-500">Assigned</div>
                        </div>
                      </div>
                    </td>
                    {daysOfWeek.map((day) => (
                      <td key={`${dentist.id}-${day}`} className="px-2 py-4">
                        <div className="space-y-1">
                          <div
                            onClick={() => handleCellClick(dentist.id, day as Day, "morning")}
                            className={`h-8 rounded border text-xs font-medium flex items-center justify-center cursor-pointer transition-all ${getCellStyling(dentist.id, day as Day, "morning")}`}
                          >
                            {getShiftInfo(dentist.id, day as Day, "morning").assigned ? "M" : getShiftInfo(dentist.id, day as Day, "morning").isAvailable ? "○" : "×"}
                          </div>

                          <div
                            onClick={() => handleCellClick(dentist.id, day as Day, "afternoon")}
                            className={`h-8 rounded border text-xs font-medium flex items-center justify-center cursor-pointer transition-all ${getCellStyling(dentist.id, day as Day, "afternoon")}`}
                          >
                            {getShiftInfo(dentist.id, day as Day, "afternoon").assigned ? "A" : getShiftInfo(dentist.id, day as Day, "afternoon").isAvailable ? "○" : "×"}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Conflicts Panel */}
        {state.conflicts.length > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Schedule Conflicts</h3>
            </div>
            <div className="space-y-2">
              {state.conflicts.map((conflict) => (
                <div key={conflict.id} className="text-sm text-red-700 bg-red-100 p-3 rounded-lg">
                  {conflict.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && selectedCell && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Shift Swap Request</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Current Assignment:</strong>
                <br />
                {dentists.find((d) => d.id === selectedCell.dentistId)?.name}
                <br />
                {selectedCell.day} - {selectedCell.shift}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => requestSwap("release")}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Release Shift</span>
              </button>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Request Swap With:</div>

                <select value={swapTargetDentist} onChange={(e) => setSwapTargetDentist(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Dentist</option>
                  {dentists.filter((d) => d.id !== selectedCell.dentistId).map((dentist) => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.name}
                    </option>
                  ))}
                </select>

                {swapTargetDentist && (
                  <>
                    <select value={swapTargetDay} onChange={(e) => setSwapTargetDay(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select Day</option>
                      {daysOfWeek.map((day) => (
                        <option key={day} value={day} className="capitalize">
                          {day}
                        </option>
                      ))}
                    </select>

                    {swapTargetDay && (
                      <select value={swapTargetShift} onChange={(e) => setSwapTargetShift(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Select Shift</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                      </select>
                    )}
                  </>
                )}

                <button
                  onClick={() => {
                    if (swapTargetDentist && swapTargetDay && swapTargetShift) {
                      requestSwap("swap", parseInt(swapTargetDentist, 10), swapTargetDay as Day, swapTargetShift as Shift);
                    }
                  }}
                  disabled={!swapTargetDentist || !swapTargetDay || !swapTargetShift}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Request Swap</span>
                </button>
              </div>
            </div>

            <button onClick={() => setShowSwapModal(false)} className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Swap Requests</h3>
              <div className="flex items-center space-x-2">
                <button onClick={() => { setShowAdminPanel(false); }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {state.swapRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending swap requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.swapRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{request.type === "swap" ? "Swap Request" : "Release Request"}</p>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>From:</strong> {request.fromDentistName} ({request.day} {request.shift})
                          {request.type === "swap" && (
                            <>
                              <br />
                              <strong>To:</strong> {request.toDentistName || "Any available dentist"} ({request.targetDay ?? "same day"} {request.targetShift ?? "same shift"})
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">Requested: {new Date(request.timestamp).toLocaleString()}</p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => approveSwap(request.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => rejectSwap(request.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors flex items-center space-x-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DentistDutiesScheduler;