import StatsPage from "@/components/Stats";
import DepartmentStaffBarChart from "@/components/DepartmentStaffBarChart";
import Sidebar from "@/components/Sidebar";

export default function Stats() {
  return (
   <div>
    <Sidebar />
    <main className="space-y-6 p-4">
      <DepartmentStaffBarChart />
      <StatsPage />
    </main>
   </div>
  );
}