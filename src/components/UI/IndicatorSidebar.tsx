'use client';

import * as React from 'react';
import { ChevronRight, ChevronLeft, Search, X } from 'lucide-react';
import type { IndicatorCategory, IndicatorId } from '@/types';
import { INDICATOR_CATEGORIES, INDICATORS_META, getIndicatorsByCategory } from '@/types';
import { useIndicator, useSetIndicator } from '@/lib/store';
import { formatNumber } from '@/lib/utils';

interface IndicatorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IndicatorSidebar({ isOpen, onClose }: IndicatorSidebarProps) {
  const currentIndicator = useIndicator();
  const setIndicator = useSetIndicator();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(
    new Set(['economico', 'saude', 'educacao'])
  );

  const filteredIndicators = React.useMemo(() => {
    if (!searchQuery) return INDICATORS_META;
    const q = searchQuery.toLowerCase();
    return INDICATORS_META.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const groupedIndicators = React.useMemo(() => {
    const groups: Record<string, Array<typeof INDICATORS_META[number]>> = {} as any;
    filteredIndicators.forEach(m => {
      if (!groups[m.category]) groups[m.category] = [];
      groups[m.category].push(m);
    });
    return groups;
  }, [filteredIndicators]);

  const toggleCategory = (cat: IndicatorCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 h-full w-96 bg-dark/95 backdrop-blur-xl border-r border-slate-800 z-40 flex flex-col animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mundi-500 to-mundi-700 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-white text-lg">Indicadores</h2>
            <p className="text-slate-500 text-xs">{filteredIndicators.length} disponíveis</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar indicador..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-mundi-500 focus:outline-none focus:ring-1 focus:ring-mundi-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {Object.entries(INDICATOR_CATEGORIES).map(([catKey, catMeta]) => {
          const category = catKey as IndicatorCategory;
          const indicators = groupedIndicators[category] || [];
          if (!indicators.length) return null;
          const isExpanded = expandedCategories.has(category);

          return (
            <div key={category} className="group">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: catMeta.color + '20' }}>
                    <svg className="w-4 h-4" style={{ color: catMeta.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {getCategoryIcon(catMeta.icon)}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{catMeta.label}</p>
                    <p className="text-slate-500 text-xs truncate">{indicators.length} indicadores</p>
                  </div>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="ml-11 mt-1 space-y-1 animate-fade-in">
                  {indicators.map(indicator => (
                    <button
                      key={indicator.id}
                      onClick={() => { setIndicator(indicator.id); onClose(); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                        currentIndicator === indicator.id
                          ? 'bg-mundi-500/20 text-white border border-mundi-500/30'
                          : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium truncate">{indicator.name}</p>
                        <p className="text-slate-500 text-xs truncate">{indicator.unit} • {indicator.source}</p>
                      </div>
                      {currentIndicator === indicator.id && (
                        <svg className="w-4 h-4 text-mundi-400 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800">
        <p className="text-slate-500 text-xs text-center">
          Dados de: World Bank, UN, WHO, UNESCO, FAO, OECD, Our World in Data
        </p>
      </div>
    </div>
  );
}

function getCategoryIcon(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    'dollar-sign': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    'users': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
    'heart-pulse': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
    'graduation-cap': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />,
    'leaf': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-3.866 0-7 3.134-7 7a7 7 0 104.181-12.442A5.99 5.99 0 0112 3z" />,
    'scale': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
    'building-2': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />,
    'hand-heart': <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  };
  return icons[iconName] || icons['dollar-sign'];
}