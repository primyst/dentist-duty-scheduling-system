import StatsPage from "@/components/Stats";
import DepartmentStaffBarChart from "@/components/DepartmentStaffBarChart";

export default function Stats() {
  return (
    <main className="space-y-6 p-4">
      <DepartmentStaffBarChart />
      <StatsPage />
    </main>
  );
}