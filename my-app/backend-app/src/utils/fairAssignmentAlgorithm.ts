export const fairShiftAssignment = (shifts, staff) => {
    const assignments = {};
    const staffCount = staff.length;
    const shiftCount = shifts.length;

    // Initialize assignments
    staff.forEach(member => {
        assignments[member.id] = [];
    });

    // Distribute shifts fairly
    for (let i = 0; i < shiftCount; i++) {
        const shift = shifts[i];
        const availableStaff = staff.filter(member => {
            return !assignments[member.id].includes(shift.id);
        });

        if (availableStaff.length > 0) {
            // Find the staff member with the least assigned shifts
            const leastAssignedMember = availableStaff.reduce((prev, curr) => {
                return assignments[prev.id].length < assignments[curr.id].length ? prev : curr;
            });

            assignments[leastAssignedMember.id].push(shift.id);
        }
    }

    return assignments;
};