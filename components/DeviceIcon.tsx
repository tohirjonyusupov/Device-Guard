import {
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Camera,
  Cpu,
  LucideIcon,
} from 'lucide-react';
import { DeviceCategory } from '@/types';

interface DeviceIconProps {
  category: DeviceCategory;
  size?: number;
  className?: string;
}

const iconMap: Record<DeviceCategory, LucideIcon> = {
  phone: Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  watch: Watch,
  headphones: Headphones,
  camera: Camera,
  other: Cpu,
};

const colorMap: Record<DeviceCategory, string> = {
  phone: 'from-blue-500 to-indigo-600',
  laptop: 'from-slate-500 to-slate-700',
  tablet: 'from-violet-500 to-purple-600',
  watch: 'from-amber-500 to-orange-600',
  headphones: 'from-pink-500 to-rose-600',
  camera: 'from-teal-500 to-cyan-600',
  other: 'from-slate-400 to-slate-600',
};

export function DeviceIcon({
  category,
  size = 24,
  className = '',
}: DeviceIconProps) {
  const Icon = iconMap[category] ?? Cpu;
  const gradient = colorMap[category] ?? colorMap.other;

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${className}`}
      style={{ width: size * 1.8, height: size * 1.8 }}
    >
      <Icon size={size} className="text-white" />
    </div>
  );
}

export function getCategoryLabel(category: DeviceCategory): string {
  const labels: Record<DeviceCategory, string> = {
    phone: 'Telefon',
    laptop: 'Noutbuk',
    tablet: 'Planshet',
    watch: 'Soat',
    headphones: 'Naushnik',
    camera: 'Kamera',
    other: 'Boshqa',
  };
  return labels[category] ?? category;
}
