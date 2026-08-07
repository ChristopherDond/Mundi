'use client';

import * as React from 'react';
import type { CountryData } from '@/types';
import { getIndicatorMeta, INDICATORS_META } from '@/types';
import { formatNumber } from '@/lib/utils';

interface GlobeTooltipProps {
  countryCode: string | null;
  value: number | null;
  indicator: string | null;
  year: number;
  countries: CountryData[];
}

export function GlobeTooltip({ countryCode, value, indicator, year, countries }: GlobeTooltipProps) {
  if (!countryCode) return null;
  
  const country = countries.find(c => c.code === countryCode);
  const indicatorMeta = indicator ? getIndicatorMeta(indicator) : null;
  
  if (!country) return null;

  return (
    <div className="absolute pointer-events-none z-20 animate-fade-in">
      <div className="glass-strong rounded-xl px-4 py-3 min-w-[220px] max-w-[280px] shadow-2xl border border-mundi-500/20">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{country.flag}</span>
          <div>
            <p className="font-semibold text-white text-lg">{country.name}</p>
            <p className="text-slate-400 text-sm">{country.code} • {country.region}</p>
          </div>
        </div>
        
        {indicatorMeta && (
          <div className="border-t border-slate-700 pt-2">
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{indicatorMeta.category}</p>
            <p className="font-medium text-slate-200">{indicatorMeta.name}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white tabular-nums">
                {value !== null ? formatNumber(value, indicatorMeta.unit) : '—'}
              </span>
              <span className="text-slate-500 text-sm">{indicatorMeta.unit}</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">{year} • Fonte: {indicatorMeta.source}</p>
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-slate-700 flex items-center gap-2 text-xs text-slate-400">
          <span>Clique para detalhes</span>
        </div>
      </div>
    </div>
  );
}