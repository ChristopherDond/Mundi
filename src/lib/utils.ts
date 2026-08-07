import type { IndicatorValue, IndicatorCategory } from '@/types';
import { INDICATOR_CATEGORIES } from '@/types';

export function formatNumber(value: number | null, unit: string): string {
  if (value === null || value === undefined) return '—';
  
  const abs = Math.abs(value);
  
  if (unit.includes('%') || unit === 'Índice (0-1)' || unit === 'Índice (0-100)' || unit === 'Índice (0-10)' || unit === 'Índice (-2.5 a 2.5)') {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
  
  if (abs >= 1e12) return (value / 1e12).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' T';
  if (abs >= 1e9) return (value / 1e9).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' B';
  if (abs >= 1e6) return (value / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' M';
  if (abs >= 1e3) return (value / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' K';
  if (abs >= 100) return value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  if (abs >= 1) return value.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
}

export function formatCompactNumber(value: number | null): string {
  if (value === null || value === undefined) return '—';
  const abs = Math.abs(value);
  if (abs >= 1e9) return (value / 1e9).toFixed(1) + 'B';
  if (abs >= 1e6) return (value / 1e6).toFixed(1) + 'M';
  if (abs >= 1e3) return (value / 1e3).toFixed(1) + 'K';
  return value.toLocaleString('pt-BR');
}

export function getColorForValue(
  value: number | null,
  indicatorId: string,
  min: number,
  max: number
): string {
  if (value === null) return '#374151'; // gray-700
  
  // Normalize 0-1
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
  
  // Some indicators are "lower is better"
  const inverseIndicators = [
    'gini', 'unemployment', 'inflation', 'child_mortality', 'maternal_mortality',
    'air_pollution', 'corruption_perception', 'poverty_rate', 'gender_inequality',
    'homicide_rate', 'press_freedom' // lower press freedom score = worse
  ];
  
  const isInverse = inverseIndicators.some(id => indicatorId.includes(id));
  const t = isInverse ? 1 - normalized : normalized;
  
  // Color scale: red (bad) → yellow → green (good)
  // Using HSL for smooth interpolation
  const hue = t * 120; // 0° = red, 120° = green
  return `hsl(${hue}, 70%, 45%)`;
}

export function getColorScale(indicatorId: string): string[] {
  const inverseIndicators = [
    'gini', 'unemployment', 'inflation', 'child_mortality', 'maternal_mortality',
    'air_pollution', 'corruption_perception', 'poverty_rate', 'gender_inequality',
    'homicide_rate', 'press_freedom'
  ];
  const isInverse = inverseIndicators.some(id => indicatorId.includes(id));
  
  if (isInverse) {
    return ['#22c55e', '#eab308', '#ef4444']; // green → yellow → red
  }
  return ['#ef4444', '#eab308', '#22c55e']; // red → yellow → green
}

export function getCategoryColor(category: IndicatorCategory): string {
  return INDICATOR_CATEGORIES[category]?.color || '#64748b';
}

export function getCategoryIcon(category: IndicatorCategory): string {
  return INDICATOR_CATEGORIES[category]?.icon || 'circle';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let lastRun = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastRun >= ms) {
      fn(...args);
      lastRun = now;
    }
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;
    await sleep(delay);
    return retry(fn, attempts - 1, delay * 2);
  }
}

export function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h] = values[i] ?? ''; });
    return obj;
  });
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(data: Record<string, unknown>[], filename: string): void {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${row[h] ?? ''}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}