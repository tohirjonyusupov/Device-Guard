'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, LoaderCircle, Lock, Mail, Phone, Shield, User } from 'lucide-react';
import { saveRegisteredUser, startSession } from '@/lib/auth';
import { RegisterForm } from '@/types';



export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordMatch = form.password.length > 0 && form.password === form.confirmPassword;
  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim().length >= 3 &&
      form.email.includes('@') &&
      form.password.length >= 6 &&
      passwordMatch &&
      form.agree
    );
  }, [form, passwordMatch]);

  const update = <K extends keyof RegisterForm>(key: K, value: RegisterForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!passwordMatch) {
      setError('Parollar mos emas.');
      return;
    }

    if (!form.agree) {
      setError("Davom etish uchun shartlarga rozilik berilishi kerak.");
      return;
    }

    setLoading(true);
    const nextUser = {
      fullName: form.fullName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
    };

    saveRegisteredUser(nextUser);
    startSession(nextUser);
    window.setTimeout(() => router.push('/dashboard'), 1000);
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 py-8 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-4xl border border-white/10 bg-white shadow-2xl shadow-slate-950/30 lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 text-white lg:block">
          <div className="absolute inset-0">
            <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-8 right-8 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />
          </div>

          <div className="relative flex h-full flex-col justify-between">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">mydevices</span>
            </Link>

            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-indigo-100">
                Device Guard
              </p>
              <h1 className="max-w-md text-4xl font-semibold leading-tight">
                Qurilmalaringizni nazorat qilish uchun akkaunt yarating.
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-indigo-100">
                Register form demo rejimda ishlaydi. Ma&apos;lumot localStorage&apos;ga
                saqlanadi va keyingi login shu ma&apos;lumot bilan tekshiriladi.
              </p>
            </div>

            <div className="space-y-3">
              {[
                "Qurilmani tez ro'yxatdan o'tkazish",
                "Yo'qolgan holatni belgilash",
                'Serial va IMEI asosida tekshirish',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-lg">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 lg:hidden">
              <Shield className="h-4 w-4 text-indigo-600" />
              mydevices
            </Link>

            <div className="mt-4 mb-8">
              <h2 className="text-3xl font-semibold text-slate-900">Ro&apos;yxatdan o&apos;tish</h2>
              <p className="mt-2 text-sm text-slate-500">
                Profil yarating va qurilmalarni bir joydan boshqaring.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">To&apos;liq ism</label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => update('fullName', e.target.value)}
                      placeholder="Ali Valiyev"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Telefon raqam</label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Parol</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      placeholder="Kamida 6 ta belgi"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Parolni tasdiqlang</label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => update('confirmPassword', e.target.value)}
                      placeholder="Qayta kiriting"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl border px-4 py-3 text-sm ${form.confirmPassword && !passwordMatch ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                {form.confirmPassword && !passwordMatch
                  ? 'Parollar bir xil emas.'
                  : 'Register qilingandan keyin avtomatik ravishda dashboard ga yo‘naltirilasiz.'}
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <label className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => update('agree', e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  Platformadan demo rejimda foydalanish va ma&apos;lumotlarni localStorage&apos;da
                  saqlashga roziman.
                </span>
              </label>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    Akkaunt yaratish <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Akkauntingiz bormi?{' '}
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                Kirish
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
