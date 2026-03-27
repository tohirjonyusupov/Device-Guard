'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Cpu,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { mockDevices } from '@/data/mockData';
import { DeviceCard } from '@/components/DeviceCard';
import { DeviceCategory, DeviceStatus } from '@/types';

const categoryOptions: {
  value: DeviceCategory | 'all';
  label: string;
  icon: React.ElementType;
}[] = [
  { value: 'all', label: 'Barchasi', icon: Shield },
  { value: 'phone', label: 'Telefonlar', icon: Smartphone },
  { value: 'laptop', label: 'Noutbuklar', icon: Laptop },
  { value: 'tablet', label: 'Planshetlar', icon: Tablet },
  { value: 'watch', label: 'Soatlar', icon: Watch },
  { value: 'headphones', label: 'Naushniklar', icon: Headphones },
  { value: 'camera', label: 'Kameralar', icon: Camera },
  { value: 'other', label: 'Boshqa', icon: Cpu },
];

const statusOptions: { value: DeviceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Barcha holat' },
  { value: 'active', label: 'Faol' },
  { value: 'lost', label: "Yo'qolgan" },
  { value: 'found', label: 'Topilgan' },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<DeviceCategory | 'all'>('all');
  const [activeStatus, setActiveStatus] = useState<DeviceStatus | 'all'>('all');

  const total = mockDevices.length;
  const activeCount = mockDevices.filter((d) => d.status === 'active').length;
  const lostCount = mockDevices.filter((d) => d.status === 'lost').length;
  const foundCount = mockDevices.filter((d) => d.status === 'found').length;

  const filtered = mockDevices.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.brand.toLowerCase().includes(search.toLowerCase()) ||
      d.serialNumber.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || d.category === activeCategory;
    const matchStatus = activeStatus === 'all' || d.status === activeStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = [
    {
      label: 'Jami qurilmalar',
      value: total,
      icon: Shield,
      color: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      change: '+2 bu oy',
    },
    {
      label: 'Faol qurilmalar',
      value: activeCount,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      change: 'Himoyalangan',
    },
    {
      label: "Yo'qolgan",
      value: lostCount,
      icon: AlertTriangle,
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
      text: 'text-red-700',
      change: 'Topilishini kuting',
    },
    {
      label: 'Topilgan',
      value: foundCount,
      icon: TrendingUp,
      color: 'from-blue-500 to-sky-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      change: 'Qaytarildi',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Qurilmalaringizni boshqaring va nazorat qiling</p>
        </div>
        <Link
          href="/add-device"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 text-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Yangi qurilma
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/70 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                  <s.icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <span className={`text-xs ${s.text} px-2 py-0.5 rounded-full ${s.bg}`}>{s.change}</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 leading-none">{s.value}</div>
            <div className="text-slate-500 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-5 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Qurilma nomi, brend yoki serial raqam..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700"
            />
          </div>
          <div className="relative sm:w-44">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value as DeviceStatus | 'all')}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 appearance-none text-slate-700 cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setActiveCategory(value as DeviceCategory | 'all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                activeCategory === value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Device List */}
      <div>
        <p className="text-slate-500 text-sm mb-4">{filtered.length} ta qurilma topildi</p>
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/70 p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-700 font-medium mb-2">Qurilma topilmadi</h3>
            <p className="text-slate-500 text-sm mb-6">Qidiruvni o'zgartiring yoki yangi qurilma qo'shing</p>
            <Link href="/add-device" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-all">
              <Plus className="w-4 h-4" /> Qurilma qo'shish
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
