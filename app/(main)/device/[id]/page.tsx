'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  Calendar,
  Hash,
  Tag,
  MapPin,
  DollarSign,
  FileText,
  Share2,
  Shield,
  X,
  Check,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { DeviceIcon, getCategoryLabel } from '@/components/DeviceIcon';
import { api } from '@/lib/api';
import { getAuthToken } from '@/lib/auth';
import { Device, DeviceStatus } from '@/types';

export default function DeviceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [device, setDevice] = useState<Device | null>(null);
  const [currentStatus, setCurrentStatus] = useState<DeviceStatus>('active');
  const [showLostModal, setShowLostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lastLocation, setLastLocation] = useState('');
  const [reward, setReward] = useState('');
  const [statusChanged, setStatusChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/login');
      return;
    }

    api
      .getDevice(id)
      .then((response) => {
        setDevice(response.device);
        setCurrentStatus(response.device.status);
        setLastLocation(response.device.lastLocation ?? '');
        setReward(response.device.reward?.toString() ?? '');
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Qurilma topilmadi'))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-500 text-sm">Qurilma yuklanmoqda...</div>
      </div>
    );
  }

  if (!device || error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-slate-700 font-medium mb-2">{error || 'Qurilma topilmadi'}</h2>
          <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 text-sm">Dashboard ga qaytish</Link>
        </div>
      </div>
    );
  }

  const notify = () => {
    setStatusChanged(true);
    setTimeout(() => setStatusChanged(false), 3000);
  };

  const changeStatus = async (status: DeviceStatus, input: Partial<Device> = {}) => {
    setActionError('');
    try {
      const response = await api.updateDeviceStatus(device.id, {
        status,
        ...input,
      });
      setDevice(response.device);
      setCurrentStatus(response.device.status);
      setLastLocation(response.device.lastLocation ?? '');
      setReward(response.device.reward?.toString() ?? '');
      setShowLostModal(false);
      notify();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Status o'zgartirilmadi.");
    }
  };

  const deleteDevice = async () => {
    setActionError('');
    try {
      await api.deleteDevice(device.id);
      router.push('/dashboard');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Qurilma o'chirilmadi.");
    }
  };

  const infoItems = [
    { icon: Hash, label: 'Serial raqam', value: device.serialNumber, mono: true },
    { icon: Tag, label: 'IMEI', value: device.imei ?? '—', mono: true },
    { icon: Shield, label: 'Kategoriya', value: getCategoryLabel(device.category), mono: false },
    { icon: Tag, label: 'Brend', value: device.brand, mono: false },
    { icon: Tag, label: 'Model', value: device.model, mono: true },
    { icon: Tag, label: 'Rangi', value: device.color ?? '—', mono: false },
    { icon: Calendar, label: "Qo'shilgan sana", value: new Date(device.dateAdded).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }), mono: false },
    { icon: Calendar, label: 'Sotib olingan', value: device.purchaseDate ? new Date(device.purchaseDate).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' }) : '—', mono: false },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-700 transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-900">{device.name}</span>
        </nav>
      </div>

      {/* Toast */}
      {actionError && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
          {actionError}
        </div>
      )}
      {statusChanged && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
          <Check className="w-4 h-4 text-emerald-400" />
          Status muvaffaqiyatli o'zgartirildi
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-sm">
            {currentStatus === 'lost' && (
              <div className="bg-red-500 px-6 py-3 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-white shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">Bu qurilma yo'qolgan deb belgilangan</div>
                  {device.lastLocation && <div className="text-red-100 text-xs">So'nggi joylashuv: {device.lastLocation}</div>}
                </div>
              </div>
            )}
            {currentStatus === 'found' && (
              <div className="bg-blue-500 px-6 py-3 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-white shrink-0" />
                <div className="text-white text-sm font-semibold">Bu qurilma topilgan</div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start gap-5">
                <DeviceIcon category={device.category} size={28} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">{device.name}</h2>
                      <p className="text-slate-500 text-sm mt-0.5">{device.brand} · {getCategoryLabel(device.category)}</p>
                    </div>
                    <StatusBadge status={currentStatus} size="md" />
                  </div>
                  {device.description && (
                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
                        <FileText className="w-3.5 h-3.5" /> Tavsif
                      </div>
                      <p className="text-slate-700 text-sm">{device.description}</p>
                    </div>
                  )}
                  {currentStatus === 'lost' && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      {(device.lastLocation || lastLocation) && (
                        <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                          <div className="flex items-center gap-1.5 text-red-500 text-xs mb-1"><MapPin className="w-3.5 h-3.5" /> So'nggi joylashuv</div>
                          <p className="text-red-700 text-sm font-medium">{lastLocation || device.lastLocation}</p>
                        </div>
                      )}
                      {(device.reward || reward) && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                          <div className="flex items-center gap-1.5 text-amber-500 text-xs mb-1"><DollarSign className="w-3.5 h-3.5" /> Mukofot</div>
                          <p className="text-amber-700 text-sm font-medium">{parseInt(reward || String(device.reward ?? 0)).toLocaleString()} so'm</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
            <h3 className="text-slate-900 font-semibold mb-4">Qurilma ma'lumotlari</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {infoItems.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                    <item.icon className="w-3 h-3" /> {item.label}
                  </div>
                  <div className={`text-slate-800 text-sm ${item.mono ? 'font-mono' : ''}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <h4 className="text-slate-700 text-sm font-semibold mb-3">Status boshqaruvi</h4>
            {currentStatus === 'active' && (
              <button onClick={() => setShowLostModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">Yo'qolgan deb belgilash</div>
                  <div className="text-red-500 text-xs">Platformada yo'qolgan sifatida ko'rinadi</div>
                </div>
              </button>
            )}
            {currentStatus === 'lost' && (
              <div className="space-y-2">
                <button onClick={() => changeStatus('found')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Topildi deb belgilash</div>
                    <div className="text-blue-500 text-xs">Qurilma topilgan sifatida ko'rinadi</div>
                  </div>
                </button>
                <button onClick={() => changeStatus('active')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all text-sm">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">Faol holga qaytarish</div>
                    <div className="text-emerald-500 text-xs">Yo'qolmagan edi deb belgilash</div>
                  </div>
                </button>
              </div>
            )}
            {currentStatus === 'found' && (
              <button onClick={() => changeStatus('active')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">Faol holga o'tkazish</div>
                  <div className="text-emerald-500 text-xs">Qurilma yana faol holatda</div>
                </div>
              </button>
            )}
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all text-sm">
                <Edit3 className="w-4 h-4" /> Tahrirlash
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all text-sm">
                <Share2 className="w-4 h-4" /> Ulashish
              </button>
              <button onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-all text-sm">
                <Trash2 className="w-4 h-4" /> O'chirish
              </button>
            </div>
          </div>

          {/* Serial info */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-sm">
            <h4 className="text-slate-700 text-sm font-semibold mb-3">Tekshirish uchun</h4>
            <p className="text-slate-500 text-xs mb-3">Kimdir tekshirmoqchi bo'lsa, serial raqamni ishlating:</p>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-2">
              <code className="text-slate-800 text-sm font-mono">{device.serialNumber}</code>
              <button onClick={() => navigator.clipboard?.writeText(device.serialNumber)}
                className="text-indigo-600 hover:text-indigo-700 text-xs font-medium shrink-0">
                Nusxa
              </button>
            </div>
            <Link href="/check" className="block mt-3 text-center text-xs text-indigo-600 hover:text-indigo-700 transition-colors">
              Tekshirish sahifasiga o'tish →
            </Link>
          </div>
        </div>
      </div>

      {/* Lost Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-slate-900 font-semibold">Yo'qolgan deb belgilash</h3>
              </div>
              <button onClick={() => setShowLostModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-600 text-sm mb-5">
              <span className="font-medium text-slate-900">{device.name}</span> qurilmasi yo'qolgan deb belgilanadi.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">So'nggi ko'rilgan joylashuv</label>
                <input value={lastLocation} onChange={(e) => setLastLocation(e.target.value)} placeholder="Toshkent, Chilonzor metro..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all placeholder-slate-400 text-slate-700" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1.5 block">Mukofot (ixtiyoriy)</label>
                <div className="relative">
                  <input type="number" value={reward} onChange={(e) => setReward(e.target.value)} placeholder="100000"
                    className="w-full pl-4 pr-16 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all placeholder-slate-400 text-slate-700" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">so'm</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowLostModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm">
                Bekor qilish
              </button>
              <button onClick={() => changeStatus('lost', {
                lastLocation,
                reward: reward ? Number(reward) : undefined,
              })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-sm shadow-sm shadow-red-200">
                Yo'qolgan deb belgilash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-slate-900 font-semibold">Qurilmani o'chirish</h3>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              <span className="font-medium text-slate-900">{device.name}</span> qurilmasi platformadan butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all text-sm">
                Bekor qilish
              </button>
              <button onClick={deleteDevice}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-sm">
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
