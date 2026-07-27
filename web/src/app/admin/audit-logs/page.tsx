import { ShieldCheck, Search } from "lucide-react";

export default function AdminAuditLogsPage() {
  const logs = [
    { id: 1, action: "Admin created Course AI Basics", user: "Super Admin", time: "10:42 AM, Oct 22", ip: "192.168.1.1" },
    { id: 2, action: "School ABC approved", user: "Super Admin", time: "09:15 AM, Oct 22", ip: "192.168.1.1" },
    { id: 3, action: "Role changed to school_admin for John Doe", user: "System", time: "08:00 AM, Oct 22", ip: "Internal" },
    { id: 4, action: "Failed login attempt", user: "Unknown", time: "07:30 AM, Oct 22", ip: "45.22.19.10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Logs</h2>
          <p className="text-sm text-slate-500 mt-1">Track every action taken by administrators on the platform.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search logs by action, user, or IP..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User / System</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                        <ShieldCheck size={16} />
                      </div>
                      <div className="font-medium text-slate-900 text-sm">{log.action}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{log.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{log.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
