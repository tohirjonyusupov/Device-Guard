import { DeviceStatus } from '@/types';

interface StatusBadgeProps {
  status: DeviceStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<
  DeviceStatus,
  { label: string; className: string; dotColor: string }
> = {
  active: {
    label: 'Faol',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotColor: 'bg-emerald-500',
  },
  lost: {
    label: "Yo'qolgan",
    className: 'bg-red-50 text-red-700 border-red-200',
    dotColor: 'bg-red-500',
  },
  found: {
    label: 'Topilgan',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dotColor: 'bg-blue-500',
  },
};

const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.className} ${sizeClasses[size]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${
          status === 'lost' ? 'animate-pulse' : ''
        }`}
      />
      {config.label}
    </span>
  );
}
