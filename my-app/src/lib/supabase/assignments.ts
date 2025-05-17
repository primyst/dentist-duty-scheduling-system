import { supabase } from "./client";
import { AssignedShift } from "@/lib/types";

export const getAssignmentsFromSupabase = async (
  date: string
): Promise<AssignedShift[]> => {
  const { data, error } = await supabase
    .from("shift_assignments")
    .select("*")
    .eq("date", date);

  if (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }

  return data as AssignedShift[];
};
