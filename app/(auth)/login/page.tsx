
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, LoaderCircle, Lock, Mail, Shield, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';
import { getRegisteredUser, saveSession } from '@/lib/auth';
import { LoginForm } from '@/types';



export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: typeof window !== 'undefined' ? getRegisteredUser()?.email ?? '' : '',
    password: '',
    remember: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return form.email.trim().length > 4 && form.password.length >= 6;
  }, [form.email, form.password]);

  const update = <K extends keyof LoginForm>(key: K, value: LoginForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const session = await api.login({
        email: form.email.trim(),
        password: form.password,
      });
      saveSession(session);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email yoki parol noto'g'ri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-100 via-white to-indigo-50">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:flex flex-col justify-between bg-slate-950 px-10 py-12 text-white">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-900/40">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">
                my<span className="text-indigo-400">devices</span>
              </span>
            </Link>
          </div>

          <div className="max-w-lg">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-indigo-200">
              <Smartphone className="h-4 w-4" />
              Xavfsiz qurilma boshqaruvi
            </div>
            <h1 className="text-4xl font-semibold leading-tight">
              Akkauntingizga kiring va qurilmalaringizni boshqaring.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Login demo rejimda ishlaydi: `register` sahifasida yaratilgan foydalanuvchi
              localStorage orqali saqlanadi va shu yerda tekshiriladi.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Qurilmalar ro'yxati bir joyda",
              "Yo'qolgan holatni tez belgilash",
              'Tekshirish sahifasiga tez kirish',
              'Demo session bilan tez sinov',
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            <div className="mb-8">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 lg:hidden">
                <Shield className="h-4 w-4 text-indigo-600" />
                mydevices
              </Link>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Kirish</h2>
              <p className="mt-2 text-sm text-slate-500">
                Davom etish uchun email va parolingizni kiriting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
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

              <label className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <span>Eslab qolish</span>
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => update('remember', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Akkauntingiz bo'lmasa, avval register sahifasida ro'yxatdan o'ting.
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  <>
                    Kirish <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Akkauntingiz yo&apos;qmi?{' '}
              <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
