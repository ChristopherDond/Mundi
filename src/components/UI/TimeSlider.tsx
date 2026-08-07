'use client';

import * as React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, FastForward, Rewind, RotateCcw } from 'lucide-react';
import { useTimeSlider, useSetYear, useSetPlaying, useSetSpeed, useNextYear, usePrevYear, useResetView } from '@/lib/store';
import { classNames } from '@/lib/utils';

export function TimeSlider() {
  const timeSlider = useTimeSlider();
  const setYear = useSetYear();
  const setPlaying = useSetPlaying();
  const setSpeed = useSetSpeed();
  const nextYear = useNextYear();
  const prevYear = usePrevYear();
  const resetView = useResetView();

  const progress = ((timeSlider.year - timeSlider.range[0]) / (timeSlider.range[1] - timeSlider.range[0])) * 100;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value, 10);
    setYear(year);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevYear();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextYear();
        break;
      case ' ':
        e.preventDefault();
        setPlaying(!timeSlider.playing);
        break;
      case 'Home':
        e.preventDefault();
        setYear(timeSlider.range[0]);
        break;
      case 'End':
        e.preventDefault();
        setYear(timeSlider.range[1]);
        break;
    }
  };

  return (
    <div
      className="glass-strong rounded-2xl px-6 py-4 border border-slate-700/50 shadow-2xl"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Controle de tempo"
      aria-valuemin={timeSlider.range[0]}
      aria-valuemax={timeSlider.range[1]}
      aria-valuenow={timeSlider.year}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-[140px]">
          <span className="text-slate-400 text-sm font-mono">{timeSlider.range[0]}</span>
          <div className="relative flex-1 max-w-[200px]">
            <input
              type="range"
              min={timeSlider.range[0]}
              max={timeSlider.range[1]}
              value={timeSlider.year}
              onChange={handleSliderChange}
              className="w-full h-2 appearance-none bg-slate-800 rounded-full cursor-pointer accent-mundi-500 focus:outline-none focus:ring-2 focus:ring-mundi-500/50"
              aria-label="Ano"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <span className="text-white font-mono font-semibold text-lg tabular-nums">{timeSlider.year}</span>
            </div>
          </div>
          <span className="text-slate-400 text-sm font-mono">{timeSlider.range[1]}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setYear(timeSlider.range[0])}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Primeiro ano"
            title="Primeiro ano (Home)"
          >
            <Rewind className="w-5 h-5" />
          </button>

          <button
            onClick={prevYear}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Ano anterior"
            title="Ano anterior (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setPlaying(!timeSlider.playing)}
            className="p-3 rounded-xl bg-mundi-500/20 hover:bg-mundi-500/30 text-mundi-400 transition-all"
            aria-label={timeSlider.playing ? 'Pausar animação' : 'Iniciar animação'}
            title={timeSlider.playing ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
          >
            {timeSlider.playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          <button
            onClick={nextYear}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Próximo ano"
            title="Próximo ano (→)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => setYear(timeSlider.range[1])}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            aria-label="Último ano"
            title="Último ano (End)"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
          <span className="text-slate-500 text-xs">Velocidade:</span>
          <select
            value={timeSlider.speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-mundi-500 focus:outline-none focus:ring-1 focus:ring-mundi-500"
            aria-label="Velocidade da animação"
          >
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>

        <button
          onClick={resetView}
          className="ml-4 p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Redefinir visualização"
          title="Redefinir visualização (R)"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-mundi-500 to-mundi-400 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-center gap-6 text-slate-500 text-xs">
        <kbd className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700">←</kbd>
        <span className="text-slate-600">Ano anterior</span>
        <kbd className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700">Espaço</kbd>
        <span className="text-slate-600">Play/Pause</span>
        <kbd className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700">→</kbd>
        <span className="text-slate-600">Próximo ano</span>
        <kbd className="px-2 py-0.5 bg-slate-900 rounded border border-slate-700">Home/End</kbd>
        <span className="text-slate-600">Início/Fim</span>
      </div>
    </div>
  );
}