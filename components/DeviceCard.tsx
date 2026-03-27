import Link from 'next/link';
import { Calendar, ChevronRight } from 'lucide-react';
import { Device } from '@/types';
import { StatusBadge } from './StatusBadge';
import { DeviceIcon, getCategoryLabel } from './DeviceIcon';

interface DeviceCardProps {
  device: Device;
}

export function DeviceCard({ device }: DeviceCardProps) {
  return (
    <Link
      href={`/device/${device.id}`}
      className="group block bg-white rounded-2xl border border-slate-200/70 p-5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="flex items-start gap-4">
        <DeviceIcon category={device.category} size={22} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-slate-900 font-medium truncate">{device.name}</h3>
              <p className="text-slate-500 text-sm mt-0.5">
                {getCategoryLabel(device.category)} • {device.brand}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={device.status} size="sm" />
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 text-xs">
              {device.serialNumber}
            </span>
            <div className="flex items-center gap-1 text-slate-400 text-xs">
              <Calendar className="w-3 h-3" />
              {new Date(device.dateAdded).toLocaleDateString('uz-UZ', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>

          {device.status === 'lost' && device.lastLocation && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              So'nggi joylashuv: {device.lastLocation}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
