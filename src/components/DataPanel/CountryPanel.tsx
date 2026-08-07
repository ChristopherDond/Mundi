'use client';

import * as React from 'react';
import { X, Share2 } from 'lucide-react';
import type { CountryData, IndicatorSeries, IndicatorValue } from '@/types';
import { getCountryByCode, getIndicatorMeta, INDICATORS_META, INDICATOR_CATEGORIES } from '@/types';
import { useSelectedCountry, useIndicator, useTimeSlider, useSetSelectedCountry, useSetPanel } from '@/lib/store';
import { fetchCountryData, fetchTimeSeriesForCountry } from '@/lib/api';
import { formatNumber, formatCompactNumber, getColorScale, classNames } from '@/lib/utils';
import { Sparkline } from './Sparkline';

interface CountryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CountryPanel({ isOpen, onClose }: CountryPanelProps) {
  const selectedCountryCode = useSelectedCountry();
  const currentIndicator = useIndicator();
  const timeSlider = useTimeSlider();
  const setSelectedCountry = useSetSelectedCountry();
  const setPanel = useSetPanel();
  const [countryData, setCountryData] = React.useState<{ indicators: Record<string, IndicatorSeries>; metadata: any } | null>(null);
  const [timeSeries, setTimeSeries] = React.useState<IndicatorValue[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'indicators' | 'compare'>('overview');

  const country = selectedCountryCode ? getCountryByCode(selectedCountryCode) : null;

  React.useEffect(() => {
    if (!selectedCountryCode) {
      setCountryData(null);
      setTimeSeries([]);
      return;
    }
    setLoading(true);
    fetchCountryData(selectedCountryCode).then(data => {
      setCountryData(data?.indicators ? { indicators: data.indicators, metadata: data.metadata } : null);
      setLoading(false);
    });
  }, [selectedCountryCode]);

  React.useEffect(() => {
    if (!selectedCountryCode || !currentIndicator) {
      setTimeSeries([]);
      return;
    }
    fetchTimeSeriesForCountry(selectedCountryCode, currentIndicator).then(setTimeSeries);
  }, [selectedCountryCode, currentIndicator]);

  if (!isOpen || !country) return null;

  const currentIndicatorMeta = currentIndicator ? getIndicatorMeta(currentIndicator) : null;
  const currentValue = timeSeries.find(v => v.year === timeSlider.year);

  return React.createElement('div', {
    className: 'fixed right-0 top-0 h-full w-96 bg-dark/95 backdrop-blur-xl border-l border-slate-800 z-40 flex flex-col animate-slide-up'
  },
    React.createElement('div', { className: 'flex items-start justify-between p-4 border-b border-slate-800' },
      React.createElement('div', { className: 'flex items-center gap-3 flex-1 min-w-0' },
        React.createElement('span', { className: 'text-3xl flex-shrink-0' }, country.flag),
        React.createElement('div', { className: 'min-w-0' },
          React.createElement('h2', { className: 'font-semibold text-white text-lg truncate' }, country.name),
          React.createElement('p', { className: 'text-slate-400 text-xs truncate' }, country.code + ' \u2022 ' + country.region + ' \u2022 ' + country.subregion)
        )
      ),
      React.createElement('div', { className: 'flex items-center gap-1' },
        React.createElement('button', { onClick: () => setPanel('compare'), className: 'p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors', title: 'Comparar' },
          React.createElement('svg', { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
            React.createElement('path', { strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 2, d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
          )
        ),
        React.createElement('button', { onClick: () => {}, className: 'p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors', title: 'Compartilhar' },
          React.createElement(Share2, { className: 'w-5 h-5' })
        ),
        React.createElement('button', { onClick: onClose, className: 'p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors' },
          React.createElement(X, { className: 'w-5 h-5' })
        )
      )
    )
  );
}
