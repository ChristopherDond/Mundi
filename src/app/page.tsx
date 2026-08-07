'use client';

import * as React from 'react';
import { Menu, X, Sun, Moon, Globe, Layers, Info, Settings, ChevronLeft, ChevronRight, Fullscreen, Minimize } from 'lucide-react';
import { Globe as GlobeComponent } from '@/components/Globe/Globe';
import { IndicatorSidebar } from '@/components/UI/IndicatorSidebar';
import { TimeSlider } from '@/components/UI/TimeSlider';
import { CountryPanel } from '@/components/DataPanel/CountryPanel';
import { getAllCountries } from '@/types';
import { useMundiStore, useUI, useSetSidebarOpen, useSetPanel, useSetTheme, useSelectedCountry, useIndicator, useTimeSlider } from '@/lib/store';
import { INDICATOR_CATEGORIES, INDICATORS_META } from '@/types';
import { classNames } from '@/lib/utils';

export default function HomePage() {
  const countries = getAllCountries();
  const ui = useUI();
  const selectedCountry = useSelectedCountry();
  const currentIndicator = useIndicator();
  const timeSlider = useTimeSlider();
  const setSidebarOpen = useSetSidebarOpen();
  const setPanel = useSetPanel();
  const setTheme = useSetTheme();

  const indicatorMeta = React.useMemo(() => {
    if (!currentIndicator) return null;
    return INDICATORS_META.find((m) => m.id === currentIndicator) || null;
  }, [currentIndicator]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main Globe */}
      <main className="absolute inset-0 z-10">
        <GlobeComponent countries={countries} />
      </main>

      {/* Left Sidebar - Indicators */}
      <IndicatorSidebar 
        isOpen={ui.sidebarOpen && ui.panel === 'indicators'}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right Panel - Country Details */}
      <CountryPanel 
        isOpen={!!selectedCountry}
        onClose={() => useMundiStore.getState().setSelectedCountry(null)}
      />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!ui.sidebarOpen)}
                className="p-2 glass rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all"
                aria-label={ui.sidebarOpen ? 'Fechar painel lateral' : 'Abrir indicadores'}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mundi-500 to-mundi-700 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-white text-xl tracking-tight">Mundi</h1>
                  <p className="text-slate-400 text-xs">Globo de dados mundiais</p>
                </div>
              </div>
            </div>

            {/* Current Indicator Display */}
            {indicatorMeta && (
              <div className="glass px-4 py-2 rounded-xl border border-slate-700/50 flex items-center gap-3 min-w-[280px] max-w-[400px]">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: INDICATOR_CATEGORIES[indicatorMeta.category as keyof typeof INDICATOR_CATEGORIES].color + '20' }}>
                  <svg className="w-4 h-4" style={{ color: INDICATOR_CATEGORIES[indicatorMeta.category as keyof typeof INDICATOR_CATEGORIES].color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{indicatorMeta.name}</p>
                  <p className="text-slate-500 text-xs truncate">{indicatorMeta.unit} • {timeSlider.year}</p>
                </div>
              </div>
            )}

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(ui.theme === 'dark' ? 'light' : 'dark')}
                className="p-2 glass rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all"
                aria-label={ui.theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
              >
                {ui.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen();
                  } else {
                    document.exitFullscreen();
                  }
                }}
                className="p-2 glass rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all"
                aria-label="Tela cheia"
              >
                <Fullscreen className="w-5 h-5" />
              </button>

              {/* Info */}
              <button
                onClick={() => setPanel('indicators')}
                className="p-2 glass rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all"
                aria-label="Sobre o Mundi"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Time Slider */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none px-4 pb-4">
        <div className="max-w-screen-2xl mx-auto pointer-events-auto">
          <TimeSlider />
        </div>
      </footer>

      {/* Selected Country Indicator (when panel closed) */}
      {selectedCountry && !ui.sidebarOpen && (
        <div className="fixed bottom-24 right-4 z-20 pointer-events-auto animate-slide-up">
          <div className="glass-strong px-4 py-3 rounded-xl border border-slate-700/50 shadow-2xl flex items-center gap-3 min-w-[200px] max-w-[300px]">
            <button
              onClick={() => useMundiStore.getState().setSelectedCountry(null)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex-shrink-0"
              aria-label="Fechar painel do país"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{countries.find(c => c.code === selectedCountry)?.name}</p>
              <p className="text-slate-400 text-xs">Clique para ver detalhes</p>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-4 left-4 z-10 pointer-events-none">
        <div className="glass px-3 py-2 rounded-lg border border-slate-700/50 text-slate-500 text-xs pointer-events-auto">
          <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700">?</kbd> Atalhos
        </div>
      </div>
    </div>
  );
}