'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  CheckCircle,
  Crown,
  Database,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react';
import { AdminStatsResponse, api } from '@/lib/api';
import { getAuthToken, getSessionUser } from '@/lib/auth';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/login');
      return;
    }

    const sessionUser = getSessionUser();
    if (sessionUser?.role && sessionUser.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    api
      .getAdminStats()
      .then(setData)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Admin statistika yuklanmadi.';
        setError(message);
        if (message === 'Forbidden') router.push('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          Admin ma&apos;lumotlari yuklanmoqda...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "Admin ma'lumotlari topilmadi."}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Jami foydalanuvchilar',
      value: data.stats.registeredUsers,
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      label: 'Adminlar',
      value: data.stats.adminUsers,
      icon: Crown,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      label: 'Oddiy userlar',
      value: data.stats.regularUsers,
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: 'Jami qurilmalar',
      value: data.stats.totalDevices,
      icon: Database,
      color: 'bg-sky-50 text-sky-700',
    },
  ];

  const deviceCards = [
    {
      label: 'Faol',
      value: data.stats.activeDevices,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      label: "Yo'qolgan",
      value: data.stats.lostDevices,
      icon: AlertTriangle,
      color: 'bg-red-50 text-red-700',
    },
    {
      label: 'Topilgan',
      value: data.stats.foundDevices,
      icon: TrendingUp,
      color: 'bg-blue-50 text-blue-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <Shield className="h-3.5 w-3.5" />
            Admin panel
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Platformadagi foydalanuvchilar va qurilmalar statistikasi.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-semibold leading-none text-slate-900">{card.value}</div>
            <div className="mt-2 text-sm text-slate-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Qurilmalar holati</h2>
          <div className="space-y-3">
            {deviceCards.map((card) => (
              <div key={card.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.color}`}>
                    <card.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{card.label}</span>
                </div>
                <span className="text-lg font-semibold text-slate-900">{card.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Oxirgi foydalanuvchilar</h2>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-500">
              <span>User</span>
              <span>Role</span>
              <span>Devices</span>
            </div>
            {data.recentUsers.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">Hali userlar yo&apos;q.</div>
            ) : (
              data.recentUsers.map((user) => (
                <div key={user.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-t border-slate-100 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">{user.fullName}</div>
                    <div className="truncate text-xs text-slate-500">{user.email}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${user.role === 'admin' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                    {user.role}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">{user.deviceCount}</span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
