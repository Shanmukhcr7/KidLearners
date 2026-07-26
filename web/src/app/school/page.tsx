import { Users, BookOpen, TrendingUp, Award, MoreVertical } from "lucide-react";

export default function SchoolDashboardOverview() {
  return (
    <div className="space-y-6">
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Here is what is happening in your school today.</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Total Students" value="0" change="0%" icon={<Users size={20} />} trend="neutral" />
        <StatCard title="Active Modules" value="0" change="0%" icon={<BookOpen size={20} />} trend="neutral" />
        <StatCard title="Average XP" value="0" change="0%" icon={<TrendingUp size={20} />} trend="neutral" />
        <StatCard title="Badges Earned" value="0" change="0%" icon={<Award size={20} />} trend="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Recent Student Activity</h3>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-200">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Recent Module</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No recent activity found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Performing Modules */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Modules</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-sm text-gray-500 text-center py-4">No modules active.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, trend }: { title: string; value: string; change: string; icon: React.ReactNode; trend: "up" | "down" | "neutral" }) {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500";
  const trendBg = trend === "up" ? "bg-green-50" : trend === "down" ? "bg-red-50" : "bg-gray-50";

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${trendBg} ${trendColor}`}>
          {change}
        </span>
      </div>
      <div>
        <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
      </div>
    </div>
  );
}

function TableRow({ name, grade, module, status }: { name: string; grade: string; module: string; status: string }) {
  const statusColor = 
    status === "Completed" ? "bg-green-100 text-green-800" : 
    status === "In Progress" ? "bg-blue-100 text-blue-800" : 
    "bg-gray-100 text-gray-800";

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grade}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{module}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={20} />
        </button>
      </td>
    </tr>
  );
}

function ModuleProgress({ title, students, percentage }: { title: string; students: number; percentage: number }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-900">{title}</span>
        <span className="text-xs text-gray-500">{students} students</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
}
