"use client";
import { toast } from "react-hot-toast";

import { useState } from "react";
import { Shield, Key, Smartphone, Globe, Lock, AlertTriangle, Check, Save } from "lucide-react";

export default function AdminSecurityPage() {
  const [settings, setSettings] = useState({
    require2FA: true,
    passwordComplexity: "high",
    sessionTimeout: "24",
    allowSSO: true,
    restrictIPs: false,
    auditLogging: true
  });

  const handleSave = () => {
    toast.success("Global security settings updated successfully!");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Security</h2>
          <p className="text-sm text-slate-500 mt-1">Configure global authentication and access control policies.</p>
        </div>
        <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm">
          <Save size={18} /> Save Policies
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Authentication Policies</h3>
                <p className="text-xs text-slate-500">Rules applied to all users during sign-in.</p>
              </div>
            </div>
            
            <div className="p-5 space-y-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between">
                <div className="pr-12">
                  <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                    Enforce Two-Factor Authentication (2FA)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Require all Super Admins and School Admins to set up SMS or Authenticator App verification.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.require2FA} onChange={() => setSettings({...settings, require2FA: !settings.require2FA})} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="pt-6">
                <h4 className="font-bold text-slate-800 text-sm mb-3">Password Complexity Requirements</h4>
                <div className="grid grid-cols-3 gap-3">
                  {['low', 'medium', 'high'].map(level => (
                    <div 
                      key={level}
                      onClick={() => setSettings({...settings, passwordComplexity: level})}
                      className={`cursor-pointer p-3 border rounded-lg text-center transition-colors ${
                        settings.passwordComplexity === level 
                        ? 'border-blue-600 bg-blue-50 text-blue-700' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-bold text-sm capitalize mb-1">{level}</div>
                      <div className="text-[10px] text-slate-500">
                        {level === 'low' && '8 chars minimum'}
                        {level === 'medium' && '10 chars, 1 number'}
                        {level === 'high' && '12 chars, symbol, number'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="pr-12">
                  <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center gap-2">
                    Allow Single Sign-On (SSO)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">Permit users to authenticate via Google or Microsoft accounts.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.allowSSO} onChange={() => setSettings({...settings, allowSSO: !settings.allowSSO})} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Access & Sessions</h3>
                <p className="text-xs text-slate-500">Manage how and where users can access the platform.</p>
              </div>
            </div>
            
            <div className="p-5 space-y-6 divide-y divide-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-1">Session Timeout</h4>
                  <p className="text-xs text-slate-500">Force logout after inactivity.</p>
                </div>
                <select 
                  className="border border-slate-300 rounded-lg p-2 text-sm bg-slate-50 font-medium"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: e.target.value})}
                >
                  <option value="1">1 Hour</option>
                  <option value="12">12 Hours</option>
                  <option value="24">24 Hours</option>
                  <option value="168">7 Days</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="pr-12">
                  <h4 className="font-bold text-slate-800 text-sm mb-1">IP Restricting</h4>
                  <p className="text-xs text-slate-500">Only allow school admins to log in from their registered school IP addresses.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={settings.restrictIPs} onChange={() => setSettings({...settings, restrictIPs: !settings.restrictIPs})} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-red-800 text-lg mb-2 flex items-center gap-2">
              <AlertTriangle size={20} /> Firebase Sync
            </h3>
            <p className="text-sm text-red-700 leading-relaxed mb-4">
              Changing these settings will propagate to your underlying Firebase Authentication configuration. 
            </p>
            <p className="text-sm text-red-700 leading-relaxed font-medium">
              If you disable SSO, users who signed up via Google will be prompted to set a password on their next login.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-slate-400" size={20} />
              <h3 className="font-bold text-slate-900">Active Admins</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">John Doe</div>
                    <div className="text-xs text-slate-500">Active now • NYC</div>
                  </div>
                </div>
                <button className="text-xs text-red-600 font-bold hover:underline">Revoke</button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Jane Smith</div>
                    <div className="text-xs text-slate-500">Active 2h ago • LON</div>
                  </div>
                </div>
                <button className="text-xs text-red-600 font-bold hover:underline">Revoke</button>
              </div>
            </div>
            <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-bold text-slate-700 rounded-lg transition-colors">
              View Audit Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
