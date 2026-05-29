'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Search,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Lock,
  Globe,
  Zap,
  Star,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { globalDeviceDatabase } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Device } from '@/types';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [foundDevice, setFoundDevice] = useState<Device | null>(null);
  const [searchDone, setSearchDone] = useState(false);

  const HERO_IMAGE = 'https://images.unsplash.com/photo-1772683748238-95a91b0f7f43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXZpY2VzJTIwc21hcnRwaG9uZSUyMGxhcHRvcCUyMGdhZGdldHN8ZW58MXx8fHwxNzczNzM3MTM2fDA&ixlib=rb-4.1.0&q=80&w=1080';

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchDone(false);
    setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      const device = globalDeviceDatabase.find(
        (d) => d.serialNumber.toLowerCase() === q || (d.imei && d.imei === q)
      );
      setFoundDevice(device ?? null);
      setSearchDone(true);
      setSearching(false);
    }, 1200);
  };

  const features = [
    {
      icon: Shield,
      title: 'Qurilmalarni himoya qiling',
      desc: "Barcha qurilmalaringizni bir joyda ro'yxatdan o'tkazing va ularni doim nazoratda saqlang.",
      color: 'from-indigo-500 to-violet-600',
      bg: 'bg-indigo-50',
    },
    {
      icon: AlertTriangle,
      title: "Yo'qolganligini bildiring",
      desc: "Qurilmangiz yo'qolsa, bir bosish bilan statusini o'zgartiring va uni topishga yordam bering.",
      color: 'from-red-500 to-rose-600',
      bg: 'bg-red-50',
    },
    {
      icon: Search,
      title: 'Qurilmani tekshiring',
      desc: "Ikkinchi qo'l qurilma sotib olishdan oldin uning serial raqami yoki IMEI orqali tekshiring.",
      color: 'from-sky-500 to-cyan-600',
      bg: 'bg-sky-50',
    },
    {
      icon: Zap,
      title: 'Tezkor natija',
      desc: 'Serial raqam yoki IMEI orqali bir soniyada qurilma holatini bilib oling.',
      color: 'from-amber-500 to-orange-600',
      bg: 'bg-amber-50',
    }
  ];

  const stats = [
    { value: '12,500+', label: "Ro'yxatdan o'tgan qurilmalar" },
    { value: '3,200+', label: 'Faol foydalanuvchilar' },
    { value: '890+', label: 'Topilgan qurilmalar' },
  ];

  const steps = [
    { num: '01', title: "Ro'yxatdan o'ting", desc: "Platformaga qurilmangiz ma'lumotlarini kiriting" },
    { num: '02', title: "Yo'qolsa bildiring", desc: "Qurilmangiz yo'qolsa statusini o'zgartiring" },
    { num: '03', title: 'Kimdir tekshiradi', desc: "Ikkinchi qo'l sotuvchilar qurilmani tekshirib ko'radi" },
    { num: '04', title: 'Topiladi!', desc: 'Qurilma egasiga qaytariladi, mukofot olinadi' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-slate-900 font-bold text-lg">
            my<span className="text-indigo-600">devices</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Imkoniyatlar</a>
          <a href="#how" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Qanday ishlaydi</a>
          <a href="#check" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Tekshirish</a>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            Kirish
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
            Boshlash <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <button className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
        <a href="#features" className="block px-4 py-2.5 rounded-xl text-sm text-slate-600">Imkoniyatlar</a>
        <a href="#how" className="block px-4 py-2.5 rounded-xl text-sm text-slate-600">Qanday ishlaydi</a>
        <a href="#check" className="block px-4 py-2.5 rounded-xl text-sm text-slate-600">Tekshirish</a>
        <Link href="/dashboard" className="block px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm mt-2">Boshlash</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-900/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm mb-6">
                <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                O'zbekistondagi eng ishonchli qurilma platformasi
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight" style={{ fontWeight: 800, lineHeight: 1.15 }}>
                Qurilmalaringizni{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  himoya qiling
                </span>
              </h1>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                MyDevices orqali barcha qurilmalaringizni ro'yxatdan o'tkazing. Yo'qolsa bir klik bilan bildirishnomabergin — topilishi osonlashsin.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-all font-medium shadow-lg shadow-indigo-900/50"
                >
                  Bepul boshlash <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#check"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-medium border border-white/10"
                >
                  <Search className="w-4 h-4" /> Qurilma tekshirish
                </a>
              </div>
            </div>

            {/* Hero image */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-900/50 border border-white/10">
                <img
                  src={HERO_IMAGE}
                  alt="Qurilmalar"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -left-6 bg-white rounded-2xl p-3 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>iPhone 15 Pro</div>
                    <div className="text-emerald-600 text-xs">Faol — Himoyalangan</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-6 bg-white rounded-2xl p-3 shadow-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <div className="text-slate-900 text-sm" style={{ fontWeight: 600 }}>AirPods Pro 2</div>
                    <div className="text-red-600 text-xs">Yo'qolgan deb belgilandi</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 rounded-full px-4 py-1.5 text-sm mb-4 border border-indigo-100">
              <Zap className="w-3.5 h-3.5" /> Imkoniyatlar
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Qurilmalaringiz uchun to'liq himoya</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              MyDevices platformasi sizga qurilmalaringizni boshqarishning eng qulay va ishonchli usulini taqdim etadi.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200/70 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className={`w-7 h-7 rounded-lg bg-linear-to-br ${f.color} flex items-center justify-center`}>
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 rounded-full px-4 py-1.5 text-sm mb-4 border border-violet-100">
              <ChevronRight className="w-3.5 h-3.5" /> Qanday ishlaydi
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">To'rt qadamda himoya</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i}>
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
                  <span className="text-xl font-bold">{step.num}</span>
                </div>
                <h3 className="text-slate-900 font-semibold mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Device Checker */}
      <section id="check" className="py-24 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full px-4 py-1.5 text-indigo-300 text-sm mb-6">
            <Search className="w-3.5 h-3.5" /> Tezkor tekshirish
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Qurilmani hoziroq tekshiring</h2>
          <p className="text-slate-400 mb-10">Serial raqam yoki IMEI raqamini kiriting — qurilmaning yo'qolgan yoki yo'qligini bilib oling.</p>

          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchDone(false); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Serial raqam yoki IMEI kiriting (masalan: F2LXP4K89Q)"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium whitespace-nowrap flex items-center gap-2"
              >
                {searching ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Tekshirish
              </button>
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Demo uchun:{' '}
              {['F2LXP4K89Q', 'H3K9M2PL1R', 'C4N0NR50X78'].map((s) => (
                <button key={s} onClick={() => setSearchQuery(s)} className="text-indigo-400 font-mono hover:text-indigo-300 mr-2">{s}</button>
              ))}
            </div>

            {searchDone && (
              <div className={`mt-5 rounded-xl p-4 text-left border ${foundDevice?.status === 'lost' ? 'bg-red-500/10 border-red-500/30' :
                foundDevice?.status === 'found' ? 'bg-blue-500/10 border-blue-500/30' :
                  foundDevice ? 'bg-emerald-500/10 border-emerald-500/30' :
                    'bg-slate-500/10 border-slate-500/30'
                }`}>
                {!foundDevice ? (
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <div className="text-white font-semibold">Qurilma topilmadi</div>
                      <div className="text-slate-400 text-sm">Bu qurilma platformada ro'yxatdan o'tmagan</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    {foundDevice.status === 'lost' ? (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white font-semibold">{foundDevice.name}</span>
                        <StatusBadge status={foundDevice.status} size="sm" />
                      </div>
                      <div className="text-slate-400 text-sm mt-0.5">{foundDevice.brand} · {foundDevice.serialNumber}</div>
                      {foundDevice.status === 'lost' && foundDevice.reward && (
                        <div className="text-amber-300 text-sm font-medium mt-1">
                          Mukofot: {foundDevice.reward.toLocaleString()} so'm
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link href="/check" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm mt-6">
            To'liq tekshirish sahifasiga o'tish <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-linear-to-br from-indigo-50 to-violet-50 rounded-3xl p-12 border border-indigo-100">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Qurilmalaringizni himoya qilishni boshlang</h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">
              Hoziroq ro'yxatdan o'ting va qurilmalaringizni platformaga kiriting. Bu bepul va faqat bir necha daqiqa vaqt oladi.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium">
              Bepul boshlash <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-bold">my<span className="text-indigo-400">devices</span></span>
            </div>
            <p className="text-sm">© 2025 MyDevices. Barcha huquqlar himoyalangan.</p>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="hover:text-white transition-colors">Maxfiylik</a>
              <a href="#" className="hover:text-white transition-colors">Shartlar</a>
              <a href="#" className="hover:text-white transition-colors">Aloqa</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
