'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Shield,
  MapPin,
  Calendar,
  DollarSign,
  Info,
  ArrowLeft,
  Smartphone,
} from 'lucide-react';
import { globalDeviceDatabase } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { Device } from '@/types';

type SearchState = 'idle' | 'loading' | 'found-lost' | 'found-active' | 'found-found' | 'not-found';

export default function CheckDevicePage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>('idle');
  const [result, setResult] = useState<Device | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setState('loading');
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      const device = globalDeviceDatabase.find(
        (d) => d.serialNumber.toLowerCase() === q || (d.imei && d.imei === q)
      );
      if (device) {
        setResult(device);
        setState(device.status === 'lost' ? 'found-lost' : device.status === 'found' ? 'found-found' : 'found-active');
      } else {
        setResult(null);
        setState('not-found');
      }
      setHistory((prev) => [query.trim(), ...prev.filter((h) => h !== query.trim())].slice(0, 5));
    }, 1400);
  };

  const examples = [
    { serial: 'F2LXP4K89Q', label: 'iPhone 15 Pro (Faol)' },
    { serial: 'H3K9M2PL1R', label: "AirPods Pro (Yo'qolgan)" },
    { serial: 'C4N0NR50X78', label: "Canon EOS R50 (Yo'qolgan)" },
    { serial: 'S8L7K3N2P1', label: 'Sony WH-1000XM5 (Topilgan)' },
  ];

  const reset = () => { setState('idle'); setResult(null); setQuery(''); };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Qurilma tekshirish</h1>
          <p className="text-slate-500 text-sm mt-0.5">Serial raqam yoki IMEI orqali qurilma holatini bilib oling</p>
        </div>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm mb-6">
        <label className="text-sm font-medium text-slate-700 mb-2 block">Serial raqam yoki IMEI kiriting</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (state !== 'idle') setState('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Masalan: F2LXP4K89Q yoki 359012345678901"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-slate-400 text-slate-700 font-mono"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query.trim() || state === 'loading'}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200 flex items-center gap-2 whitespace-nowrap"
          >
            {state === 'loading' ? (
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
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-400 mb-2">Demo namunalar:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex.serial}
                onClick={() => { setQuery(ex.serial); setState('idle'); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 hover:bg-slate-100 hover:border-indigo-200 transition-all"
              >
                <code className="text-indigo-600 font-mono">{ex.serial}</code>
                <span className="text-slate-400">—</span>
                <span>{ex.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {state === 'loading' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-12 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-slate-600 text-sm">Ma'lumotlar bazasidan qidirilmoqda...</p>
          <p className="text-slate-400 text-xs mt-1">Bu bir necha soniya davom etadi</p>
        </div>
      )}

      {/* Not found */}
      {state === 'not-found' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-8 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-semibold mb-2">Qurilma topilmadi</h3>
          <p className="text-slate-500 text-sm mb-2">
            "<span className="font-mono text-slate-700">{query}</span>" raqamli qurilma platformada ro'yxatdan o'tmagan.
          </p>
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-left">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-800 text-sm font-medium">Bu nimani anglatadi?</p>
                <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                  Qurilma yo'qolgan deb belgilanmagan yoki hali platformaga qo'shilmagan. Sotib olishdan oldin sotuvchidan hujjatlarni so'rang.
                </p>
              </div>
            </div>
          </div>
          <button onClick={reset} className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 transition-colors">Yana tekshirish</button>
        </div>
      )}

      {/* Found - Lost */}
      {state === 'found-lost' && result && (
        <div className="space-y-4">
          <div className="bg-red-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">Diqqat! Bu qurilma yo'qolgan!</div>
                <div className="text-red-100 text-sm">Bu qurilmani sotib olmang</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Smartphone className="w-4 h-4 text-red-200 shrink-0" />
                <span className="font-semibold">{result.name}</span>
                <StatusBadge status="lost" size="sm" />
              </div>
              <div className="text-red-100 text-sm">Serial: <code className="font-mono bg-white/10 px-1 rounded">{result.serialNumber}</code></div>
              {result.dateLost && (
                <div className="flex items-center gap-2 text-red-100 text-sm">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  Yo'qolgan sana: {new Date(result.dateLost).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
              {result.lastLocation && (
                <div className="flex items-center gap-2 text-red-100 text-sm">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> So'nggi joylashuv: {result.lastLocation}
                </div>
              )}
              {result.reward && (
                <div className="flex items-center gap-2 text-amber-200 text-sm font-semibold">
                  <DollarSign className="w-3.5 h-3.5 shrink-0" /> Mukofot: {result.reward.toLocaleString()} so'm
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-800 text-sm font-medium">Nima qilish kerak?</p>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Agar bu qurilma sizning qo'lingizda bo'lsa, egasiga qaytaring va mukofot oling. Agar sotuvchida ko'rsangiz, sotib olmang va politsiyaga xabar bering.</p>
              </div>
            </div>
          </div>
          <button onClick={reset} className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Yana tekshirish
          </button>
        </div>
      )}

      {/* Found - Active */}
      {state === 'found-active' && result && (
        <div className="space-y-4">
          <div className="bg-emerald-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">Qurilma xavfsiz!</div>
                <div className="text-emerald-100 text-sm">Bu qurilma yo'qolmagan yoki o'g'irlanmagan</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Smartphone className="w-4 h-4 text-emerald-200 shrink-0" />
                <span className="font-semibold">{result.name}</span>
                <StatusBadge status="active" size="sm" />
              </div>
              <div className="text-emerald-100 text-sm">{result.brand} · Serial: <code className="font-mono bg-white/10 px-1 rounded">{result.serialNumber}</code></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-slate-800 text-sm font-medium">Xavfsiz sotib olish mumkin</p>
                <p className="text-slate-600 text-xs mt-1 leading-relaxed">Bu qurilma platformamizda faol sifatida ro'yxatdan o'tgan va yo'qolgan deb belgilanmagan. Shunga qaramay, sotuvchidan hujjatlarini so'rang.</p>
              </div>
            </div>
          </div>
          <button onClick={reset} className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Yana tekshirish
          </button>
        </div>
      )}

      {/* Found - Found status */}
      {state === 'found-found' && result && (
        <div className="space-y-4">
          <div className="bg-blue-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-white font-bold text-lg">Bu qurilma topilgan edi</div>
                <div className="text-blue-100 text-sm">Avval yo'qolgan, endi topilgan</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-white">
                <Smartphone className="w-4 h-4 text-blue-200 shrink-0" />
                <span className="font-semibold">{result.name}</span>
                <StatusBadge status="found" size="sm" />
              </div>
              <div className="text-blue-100 text-sm">{result.brand} · Serial: <code className="font-mono bg-white/10 px-1 rounded">{result.serialNumber}</code></div>
            </div>
          </div>
          <button onClick={reset} className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Yana tekshirish
          </button>
        </div>
      )}

      {/* How to find serial */}
      {state === 'idle' && (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
          <h3 className="text-slate-900 font-semibold text-sm mb-4">Serial raqamni qayerdan topaman?</h3>
          <div className="space-y-3">
            {[
              { device: 'iPhone / iPad', where: 'Sozlamalar → Umumiy → Haqida → Serial raqam' },
              { device: 'Android telefonlar', where: 'Sozlamalar → Telefon haqida → IMEI / Serial raqam' },
              { device: 'Noutbuklar', where: 'Qurilma tagida, qutisida yoki BIOS da' },
              { device: 'Samsung qurilmalari', where: '*#06# raqamini terish orqali IMEI' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-slate-800 text-sm font-medium">{item.device}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{item.where}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6 bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
          <h4 className="text-slate-700 text-sm font-semibold mb-3">So'nggi qidiruvlar</h4>
          <div className="space-y-1">
            {history.map((h, i) => (
              <button key={i} onClick={() => { setQuery(h); setState('idle'); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors text-sm">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <code className="text-slate-600 font-mono text-xs">{h}</code>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
