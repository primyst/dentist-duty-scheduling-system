import React, { useState, useEffect, useReducer } from 'react';
import { 
  Calendar, Users, RefreshCw, CheckCircle, XCircle, 
  AlertTriangle, Download, 
  Clock, ArrowRightLeft, Bell,
  ChevronRight, ChevronLeft, UserCheck
} from 'lucide-react';

// Initial dentist data with availability and constraints
const initialDentists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    maxWeeklyShifts: 5,
    availability: {
      monday: ['morning', 'afternoon'],
      tuesday: ['morning', 'afternoon'],
      wednesday: ['morning'],
      thursday: ['afternoon'],
      friday: ['morning', 'afternoon'],
      saturday: ['morning'],
      sunday: []
    }
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    maxWeeklyShifts: 4,
    availability: {
      monday: ['afternoon'],
      tuesday: ['morning', 'afternoon'],
      wednesday: ['morning', 'afternoon'],
      thursday: ['morning', 'afternoon'],
      friday: ['morning'],
      saturday: [],
      sunday: ['morning']
    }
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    maxWeeklyShifts: 6,
    availability: {
      monday: ['morning', 'afternoon'],
      tuesday: ['morning'],
      wednesday: ['afternoon'],
      thursday: ['morning', 'afternoon'],
      friday: ['afternoon'],
      saturday: ['morning', 'afternoon'],
      sunday: ['afternoon']
    }
  },
  {
    id: 4,
    name: "Dr. David Williams",
    maxWeeklyShifts: 3,
    availability: {
      monday: ['morning'],
      tuesday: ['afternoon'],
      wednesday: ['morning', 'afternoon'],
      thursday: ['morning'],
      friday: [],
      saturday: ['afternoon'],
      sunday: ['morning', 'afternoon']
    }
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    maxWeeklyShifts: 5,
    availability: {
      monday: ['afternoon'],
      tuesday: ['morning', 'afternoon'],
      wednesday: ['morning'],
      thursday: ['afternoon'],
      friday: ['morning', 'afternoon'],
      saturday: ['morning'],
      sunday: ['morning']
    }
  }
];

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const shifts = ['morning', 'afternoon'];

// Schedule reducer for managing complex state
const scheduleReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCHEDULE':
      return { ...state, schedule: action.payload };
    case 'ADD_SWAP_REQUEST':
      return { 
        ...state, 
        swapRequests: [...state.swapRequests, action.payload]
      };
    case 'APPROVE_SWAP':
      const approvedSwap = state.swapRequests.find(req => req.id === action.payload);
      if (!approvedSwap) return state;
      
      const newSchedule = { ...state.schedule };
      
      // Perform the swap
      if (approvedSwap.type === 'swap') {
        const temp = newSchedule[approvedSwap.fromDentist]?.[approvedSwap.day]?.[approvedSwap.shift];
        if (newSchedule[approvedSwap.fromDentist] && newSchedule[approvedSwap.fromDentist][approvedSwap.day]) {
          newSchedule[approvedSwap.fromDentist][approvedSwap.day][approvedSwap.shift] = 
            newSchedule[approvedSwap.toDentist]?.[approvedSwap.targetDay]?.[approvedSwap.targetShift];
        }
        if (newSchedule[approvedSwap.toDentist] && newSchedule[approvedSwap.toDentist][approvedSwap.targetDay]) {
          newSchedule[approvedSwap.toDentist][approvedSwap.targetDay][approvedSwap.targetShift] = temp;
        }
      } else if (approvedSwap.type === 'release') {
        if (newSchedule[approvedSwap.fromDentist] && newSchedule[approvedSwap.fromDentist][approvedSwap.day]) {
          newSchedule[approvedSwap.fromDentist][approvedSwap.day][approvedSwap.shift] = null;
        }
      }
      
      return {
        ...state,
        schedule: newSchedule,
        swapRequests: state.swapRequests.filter(req => req.id !== action.payload)
      };
    case 'REJECT_SWAP':
      return {
        ...state,
        swapRequests: state.swapRequests.filter(req => req.id !== action.payload)
      };
    case 'CLEAR_CONFLICTS':
      return { ...state, conflicts: [] };
    case 'SET_CONFLICTS':
      return { ...state, conflicts: action.payload };
    default:
      return state;
  }
};

const DentistDutiesScheduler = () => {
  const [dentists] = useState(initialDentists);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  
  const [state, dispatch] = useReducer(scheduleReducer, {
    schedule: {},
    swapRequests: [],
    conflicts: []
  });

  // Auto-assign shifts with workload balancing and conflict detection
  const autoAssignShifts = () => {
    const newSchedule = {};
    const dentistShiftCounts = {};
    const conflicts = [];
    
    // Initialize dentist schedule and shift counts
    dentists.forEach(dentist => {
      newSchedule[dentist.id] = {};
      dentistShiftCounts[dentist.id] = 0;
      daysOfWeek.forEach(day => {
        newSchedule[dentist.id][day] = { morning: null, afternoon: null };
      });
    });

    // Get all possible assignments
    const allAssignments = [];
    dentists.forEach(dentist => {
      daysOfWeek.forEach(day => {
        shifts.forEach(shift => {
          if (dentist.availability[day]?.includes(shift)) {
            allAssignments.push({
              dentistId: dentist.id,
              day,
              shift,
              dentistName: dentist.name,
              maxShifts: dentist.maxWeeklyShifts
            });
          }
        });
      });
    });

    // Sort assignments to prioritize balanced workload
    allAssignments.sort((a, b) => {
      const countA = dentistShiftCounts[a.dentistId];
      const countB = dentistShiftCounts[b.dentistId];
      return countA - countB;
    });

    // Assign shifts ensuring coverage and balance
    const shiftRequirements = {};
    daysOfWeek.forEach(day => {
      shiftRequirements[day] = { morning: 1, afternoon: 1 }; // At least 1 dentist per shift
    });

    allAssignments.forEach(assignment => {
      const { dentistId, day, shift, maxShifts } = assignment;
      
      // Check if dentist hasn't exceeded max shifts
      if (dentistShiftCounts[dentistId] < maxShifts) {
        // Check if shift still needs coverage
        if (shiftRequirements[day][shift] > 0) {
          // Check for same-day conflicts
          const hasConflict = shifts.some(s => 
            s !== shift && newSchedule[dentistId][day][s] !== null
          );
          
          if (!hasConflict) {
            newSchedule[dentistId][day][shift] = {
              dentistId,
              dentistName: dentists.find(d => d.id === dentistId).name,
              assigned: true,
              day,
              shift
            };
            dentistShiftCounts[dentistId]++;
            shiftRequirements[day][shift]--;
          } else {
            conflicts.push({
              id: `conflict-${dentistId}-${day}`,
              message: `${dentists.find(d => d.id === dentistId).name} has conflicting shifts on ${day}`,
              dentistId,
              day,
              type: 'same-day-conflict'
            });
          }
        }
      }
    });

    // Detect uncovered shifts
    daysOfWeek.forEach(day => {
      shifts.forEach(shift => {
        if (shiftRequirements[day][shift] > 0) {
          conflicts.push({
            id: `uncovered-${day}-${shift}`,
            message: `No coverage for ${shift} shift on ${day}`,
            day,
            shift,
            type: 'no-coverage'
          });
        }
      });
    });

    dispatch({ type: 'SET_SCHEDULE', payload: newSchedule });
    dispatch({ type: 'SET_CONFLICTS', payload: conflicts });
  };

  // Initialize with auto-assignment
  useEffect(() => {
    autoAssignShifts();
  }, []);

  // Handle cell click for swap requests
  const handleCellClick = (dentistId, day, shift) => {
    if (!isAdmin) {
      setSelectedCell({ dentistId, day, shift });
      setShowSwapModal(true);
    }
  };

  // Request shift swap
  const requestSwap = (type, targetDentist = null, targetDay = null, targetShift = null) => {
    if (!selectedCell) return;
    
    const swapRequest = {
      id: Date.now(),
      type, // 'swap' or 'release'
      fromDentist: selectedCell.dentistId,
      day: selectedCell.day,
      shift: selectedCell.shift,
      toDentist: targetDentist,
      targetDay: targetDay,
      targetShift: targetShift,
      timestamp: new Date(),
      status: 'pending',
      fromDentistName: dentists.find(d => d.id === selectedCell.dentistId)?.name,
      toDentistName: targetDentist ? dentists.find(d => d.id === targetDentist)?.name : null
    };
    
    dispatch({ type: 'ADD_SWAP_REQUEST', payload: swapRequest });
    setShowSwapModal(false);
    setSelectedCell(null);
    setSwapTargetDentist('');
    setSwapTargetDay('');
    setSwapTargetShift('');
  };

  // Calculate total shifts per dentist
  

  // Week navigation
  const navigateWeek = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedWeek(newDate);
  };

  // Get week date range
  const getWeekRange = () => {
    const startOfWeek = new Date(selectedWeek);
    startOfWeek.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return {
      start: startOfWeek,
      end: endOfWeek
    };
  };

  // Get shift display info
  const getShiftInfo = (dentistId, day, shift) => {
    const assignment = state.schedule[dentistId]?.[day]?.[shift];
    if (assignment) {
      return {
        assigned: true,
        dentistName: assignment.dentistName,
        isAvailable: true
      };
    }
    
    const dentist = dentists.find(d => d.id === dentistId);
    const isAvailable = dentist?.availability[day]?.includes(shift);
    
    return {
      assigned: false,
      dentistName: null,
      isAvailable
    };
  };

  // Get cell styling
  const getCellStyling = (dentistId, day, shift) => {
    const shiftInfo = getShiftInfo(dentistId, day, shift);
    const hasConflict = state.conflicts.some(c => 
      c.dentistId === dentistId && c.day === day
    );
    
    if (hasConflict) {
      return 'bg-red-100 border-red-300 text-red-800';
    }
    
    if (shiftInfo.assigned) {
      return shift === 'morning' 
        ? 'bg-blue-100 border-blue-300 text-blue-800'
        : 'bg-green-100 border-green-300 text-green-800';
    }
    
    if (shiftInfo.isAvailable) {
      return 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100';
    }
    
    return 'bg-gray-200 border-gray-300 text-gray-400';
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvData = [];
    csvData.push(['Dentist', ...daysOfWeek.map(day => `${day} Morning`), ...daysOfWeek.map(day => `${day} Afternoon`)]);
    
    dentists.forEach(dentist => {
      const row = [dentist.name];
      daysOfWeek.forEach(day => {
        const morningShift = getShiftInfo(dentist.id, day, 'morning');
        row.push(morningShift.assigned ? 'Assigned' : (morningShift.isAvailable ? 'Available' : 'Not Available'));
      });
      daysOfWeek.forEach(day => {
        const afternoonShift = getShiftInfo(dentist.id, day, 'afternoon');
        row.push(afternoonShift.assigned ? 'Assigned' : (afternoonShift.isAvailable ? 'Available' : 'Not Available'));
      });
      csvData.push(row);
    });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dentist-schedule.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  isAdmin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <UserCheck className="w-4 h-4 inline mr-1" />
                Admin
              </button>
              <button 
                onClick={() => setIsAdmin(false)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  !isAdmin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Dentist
              </button>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowAdminPanel(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {state.swapRequests.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {state.swapRequests.length}
                  </span>
                )}
              </button>
            </div>
            
            <button 
              onClick={autoAssignShifts}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Auto Assign</span>
            </button>
            
            <button 
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
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
                <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                <span className="text-sm text-gray-600">Morning Shift</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                <span className="text-sm text-gray-600">Afternoon Shift</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                <span className="text-sm text-gray-600">Conflict</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></div>
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
                <button 
                  onClick={() => navigateWeek(-1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <Clock className="w-4 h-4" />
                <span>
                  {getWeekRange().start.toLocaleDateString()} - {getWeekRange().end.toLocaleDateString()}
                </span>
                <button 
                  onClick={() => navigateWeek(1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
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
                  {daysOfWeek.map(day => (
                    <th key={day} className="px-4 py-4 text-center text-sm font-semibold text-gray-900 min-w-32">
                      <div className="capitalize">{day}</div>
                      <div className="text-xs text-gray-500 font-normal mt-1">M / A</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {dentists.map(dentist => (
                  <tr key={dentist.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {dentist.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{dentist.name}</div>
                            <div className="text-sm text-gray-500">
                              Max: {dentist.maxWeeklyShifts} shifts/week
                            </div>
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
                    {daysOfWeek.map(day => (
                      <td key={`${dentist.id}-${day}`} className="px-2 py-4">
                        <div className="space-y-1">
                          {/* Morning Shift */}
                          <div
                            onClick={() => handleCellClick(dentist.id, day, 'morning')}
                            className={`h-8 rounded border text-xs font-medium flex items-center justify-center cursor-pointer transition-all ${getCellStyling(dentist.id, day, 'morning')}`}
                          >
                            {getShiftInfo(dentist.id, day, 'morning').assigned ? 'M' : 
                             getShiftInfo(dentist.id, day, 'morning').isAvailable ? '○' : '×'}
                          </div>
                          {/* Afternoon Shift */}
                          <div
                            onClick={() => handleCellClick(dentist.id, day, 'afternoon')}
                            className={`h-8 rounded border text-xs font-medium flex items-center justify-center cursor-pointer transition-all ${getCellStyling(dentist.id, day, 'afternoon')}`}
                          >
                            {getShiftInfo(dentist.id, day, 'afternoon').assigned ? 'A' : 
                             getShiftInfo(dentist.id, day, 'afternoon').isAvailable ? '○' : '×'}
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
              {state.conflicts.map(conflict => (
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
                <strong>Current Assignment:</strong><br />
                {dentists.find(d => d.id === selectedCell.dentistId)?.name}<br />
                {selectedCell.day} - {selectedCell.shift}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => requestSwap('release')}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Release Shift</span>
              </button>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">Request Swap With:</div>
                
                <select
                  value={swapTargetDentist}
                  onChange={(e) => setSwapTargetDentist(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Dentist</option>
                  {dentists
                    .filter(d => d.id !== selectedCell.dentistId)
                    .map(dentist => (
                      <option key={dentist.id} value={dentist.id}>
                        {dentist.name}
                      </option>
                    ))}
                </select>

                {swapTargetDentist && (
                  <>
                    <select
                      value={swapTargetDay}
                      onChange={(e) => setSwapTargetDay(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day} className="capitalize">
                          {day}
                        </option>
                      ))}
                    </select>

                    {swapTargetDay && (
                      <select
                        value={swapTargetShift}
                        onChange={(e) => setSwapTargetShift(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
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
                      requestSwap('swap', parseInt(swapTargetDentist), swapTargetDay, swapTargetShift);
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

            <button
              onClick={() => setShowSwapModal(false)}
              className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
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
              <button 
                onClick={() => setShowAdminPanel(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {state.swapRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending swap requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.swapRequests.map(request => (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">
                          {request.type === 'swap' ? 'Swap Request' : 'Release Request'}
                        </p>
                        <p className="text-sm text-gray-600 mb-3">
                          <strong>From:</strong> {request.fromDentistName} ({request.day} {request.shift})
                          {request.type === 'swap' && (
                            <>
                              <br />
                              <strong>To:</strong> {request.toDentistName || 'Any available dentist'}
                            </>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Requested: {request.timestamp.toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => dispatch({ type: 'APPROVE_SWAP', payload: request.id })}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => dispatch({ type: 'REJECT_SWAP', payload: request.id })}
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