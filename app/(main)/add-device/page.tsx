'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Cpu,
  Check,
  ChevronRight,
} from 'lucide-react';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { DeviceCategory } from '@/types';

const categories: {
  value: DeviceCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { value: 'phone', label: 'Telefon', icon: Smartphone, color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-50 border-blue-200' },
  { value: 'laptop', label: 'Noutbuk', icon: Laptop, color: 'from-slate-500 to-slate-700', bg: 'bg-slate-50 border-slate-200' },
  { value: 'tablet', label: 'Planshet', icon: Tablet, color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50 border-violet-200' },
  { value: 'watch', label: 'Soat', icon: Watch, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 border-amber-200' },
  { value: 'headphones', label: 'Naushnik', icon: Headphones, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50 border-pink-200' },
  { value: 'camera', label: 'Kamera', icon: Camera, color: 'from-teal-500 to-cyan-600', bg: 'bg-teal-50 border-teal-200' },
  { value: 'other', label: 'Boshqa', icon: Cpu, color: 'from-slate-400 to-slate-600', bg: 'bg-slate-50 border-slate-200' },
];

interface FormData {
  name: string;
  brand: string;
  model: string;
  category: DeviceCategory | '';
  serialNumber: string;
  imei: string;
  color: string;
  purchaseDate: string;
  description: string;
}

const steps = ["Kategoriya", "Asosiy ma'lumotlar", "Qo'shimcha", "Tasdiqlash"];

export default function AddDevicePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    name: '',
    brand: '',
    model: '',
    category: '',
    serialNumber: '',
    imei: '',
    color: '',
    purchaseDate: '',
    description: '',
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canNext = () => {
    if (step === 0) return !!form.category;
    if (step === 1) return !!form.name && !!form.brand && !!form.serialNumber;
    return true;
  };

  const handleSubmit = async () => {
    if (!getAuthToken()) {
      router.push('/login');
      return;
    }

    setError('');
    try {
      await api.createDevice({
        name: form.name,
        brand: form.brand,
        model: form.model,
        category: form.category || undefined,
        serialNumber: form.serialNumber,
        imei: form.imei || undefined,
        color: form.color || undefined,
        purchaseDate: form.purchaseDate || undefined,
        description: form.description || undefined,
      });
      setSubmitted(true);
      setTimeout(() => router.push('/dashboard'), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qurilmani saqlashda xatolik yuz berdi.");
    }
  };

  const selectedCat = categories.find((c) => c.value === form.category);

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md w-full shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-3">Qurilma qo'shildi!</h2>
          <p className="text-slate-500 text-sm mb-6">
            <span className="font-medium text-slate-900">{form.name}</span> muvaffaqiyatli platformaga ro'yxatdan o'tkazildi.
          </p>
          <div className="flex items-center gap-2 justify-center text-sm text-slate-500">
            <svg className="w-4 h-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Dashboard ga yo'naltirilmoqda...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Yangi qurilma qo'shish</h1>
          <p className="text-slate-500 text-sm mt-0.5">Qurilmangizni platformaga ro'yxatdan o'tkazing</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 font-semibold transition-all ${
                  i < step ? 'bg-indigo-600 text-white' :
                  i === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' :
                  'bg-white border-2 border-slate-200 text-slate-400'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i <= step ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 rounded-full transition-all ${i < step ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-slate-900 font-medium">{steps[step]}</h3>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step 0: Category */}
          {step === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => update('category', cat.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    form.category === cat.value
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : `${cat.bg} hover:border-slate-300`
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${form.category === cat.value ? 'text-indigo-700' : 'text-slate-700'}`}>
                    {cat.label}
                  </span>
                  {form.category === cat.value && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 1: Main info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Qurilma nomi *</label>
                  <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="iPhone 15 Pro"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Brend *</label>
                  <input value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder="Apple, Samsung, Dell..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Model</label>
                <input value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="A3293, SM-S918B..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Serial raqam *</label>
                <input value={form.serialNumber} onChange={(e) => update('serialNumber', e.target.value.toUpperCase())} placeholder="F2LXP4K89Q"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 placeholder:font-sans text-slate-700 uppercase" />
                <p className="text-slate-400 text-xs mt-1.5">Qurilma sozlamalarida yoki qutisida topasiz</p>
              </div>
              {(form.category === 'phone' || form.category === 'tablet') && (
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">IMEI raqami</label>
                  <input value={form.imei} onChange={(e) => update('imei', e.target.value)} placeholder="359012345678901"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 placeholder:font-sans text-slate-700" />
                  <p className="text-slate-400 text-xs mt-1.5">*#06# orqali bilib olasiz</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Additional */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Rangi</label>
                  <input value={form.color} onChange={(e) => update('color', e.target.value)} placeholder="Qora, Oq, Kumush..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">Sotib olingan sana</label>
                  <input type="date" value={form.purchaseDate} onChange={(e) => update('purchaseDate', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all text-slate-700" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Tavsif</label>
                <textarea value={form.description} onChange={(e) => update('description', e.target.value)}
                  placeholder="Qurilma haqida qo'shimcha ma'lumot kiriting..." rows={4}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700 resize-none" />
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && selectedCat && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedCat.color} flex items-center justify-center shadow-lg shrink-0`}>
                  <selectedCat.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-slate-900 font-semibold text-lg">{form.name}</div>
                  <div className="text-slate-500 text-sm">{form.brand} · {selectedCat.label}</div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: 'Serial raqam', value: form.serialNumber },
                  { label: 'Model', value: form.model || '—' },
                  { label: 'IMEI', value: form.imei || '—' },
                  { label: 'Rangi', value: form.color || '—' },
                  { label: 'Sotib olingan', value: form.purchaseDate ? new Date(form.purchaseDate).toLocaleDateString('uz-UZ') : '—' },
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div className="text-slate-400 text-xs mb-0.5">{item.label}</div>
                    <div className="text-slate-800 text-sm font-mono">{item.value}</div>
                  </div>
                ))}
              </div>
              {form.description && (
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <div className="text-slate-400 text-xs mb-0.5">Tavsif</div>
                  <div className="text-slate-800 text-sm">{form.description}</div>
                </div>
              )}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Qurilma ma'lumotlar bazasiga qo'shiladi
                </div>
                <p className="text-emerald-600 text-xs mt-1">Serial raqam orqali tekshirish imkoniyati yoqiladi</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between gap-3">
          <button
            onClick={() => step === 0 ? router.push('/dashboard') : setStep((s) => s - 1)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? 'Bekor qilish' : 'Orqaga'}
          </button>
          <button
            onClick={() => step === steps.length - 1 ? handleSubmit() : setStep((s) => s + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm shadow-sm shadow-indigo-200"
          >
            {step === steps.length - 1 ? (
              <><Check className="w-4 h-4" /> Saqlash</>
            ) : (
              <>Davom etish <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
