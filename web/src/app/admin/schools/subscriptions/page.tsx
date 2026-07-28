"use client";

import { useState, useEffect } from "react";
import { auth } from "@/utils/firebase";
import { CreditCard, Building, Calendar, DollarSign, Search, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface Subscription {
  id: string;
  schoolId: string;
  schoolName: string;
  plan: string;
  status: "Active" | "Past Due" | "Canceled";
  amount: number;
  billingCycle: string;
  nextBillingDate: string;
}

export default function AdminSchoolsSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  async function fetchSubscriptions() {
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch((process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/schools/subscriptions", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-500 flex flex-col items-center"><Loader2 size={32} className="animate-spin mb-4" /> Loading subscriptions...</div>;

  const totalMRR = subscriptions.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.amount, 0);
  const pastDue = subscriptions.filter(s => s.status === 'Past Due').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Subscriptions & Billing</h2>
          <p className="text-sm text-slate-500 mt-1">Manage SaaS plans, MRR, and billing status for all schools.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Monthly Recurring Revenue</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalMRR.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Building size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Active Schools</p>
              <h3 className="text-2xl font-bold text-slate-900">{subscriptions.filter(s => s.status === 'Active').length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Past Due Accounts</p>
              <h3 className="text-2xl font-bold text-slate-900">{pastDue}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search school name..." className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <th className="px-6 py-4">School</th>
                <th className="px-6 py-4">Plan & Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Next Billing Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {subscriptions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-slate-500 font-medium">No real subscriptions found. Awaiting Stripe integration.</td></tr>
              ) : subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {sub.schoolName.charAt(0)}
                      </div>
                      <div className="font-bold text-slate-900">{sub.schoolName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{sub.plan}</div>
                    <div className="text-sm text-slate-500">${sub.amount} / {sub.billingCycle.toLowerCase()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full items-center gap-1 ${
                      sub.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      sub.status === 'Past Due' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {sub.status === 'Active' && <CheckCircle size={12} />}
                      {sub.status === 'Past Due' && <AlertTriangle size={12} />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
