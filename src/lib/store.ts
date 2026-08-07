import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ViewState, IndicatorCategory, CountryData, IndicatorId } from '@/types';

interface MundiStore extends ViewState {
  // Actions
  setSelectedCountry: (code: string | null) => void;
  setHoveredCountry: (code: string | null) => void;
  setIndicator: (id: IndicatorId | null) => void;
  setYear: (year: number) => void;
  setPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setTimeRange: (range: [number, number]) => void;
  setCamera: (camera: Partial<ViewState['camera']>) => void;
  setSidebarOpen: (open: boolean) => void;
  setPanel: (panel: ViewState['ui']['panel']) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  resetView: () => void;
  nextYear: () => void;
  prevYear: () => void;
}

const DEFAULT_CAMERA = {
  longitude: -45,
  latitude: 10,
  height: 18000000,
  heading: 0,
  pitch: -90,
  roll: 0,
};

const DEFAULT_TIME_SLIDER = {
  year: 2022,
  playing: false,
  speed: 1,
  range: [1960, 2024] as [number, number],
};

const DEFAULT_UI = {
  sidebarOpen: true,
  panel: 'indicators' as const,
  theme: 'dark' as const,
};

export const useMundiStore = create<MundiStore>()(
  persist(
    (set, get) => ({
      // State
      selectedCountry: null,
      hoveredCountry: null,
      indicator: 'gdp_per_capita',
      timeSlider: DEFAULT_TIME_SLIDER,
      camera: DEFAULT_CAMERA,
      ui: DEFAULT_UI,

      // Actions
      setSelectedCountry: (code) => set({ selectedCountry: code }),
      setHoveredCountry: (code) => set({ hoveredCountry: code }),
      setIndicator: (id) => set({ indicator: id }),
      setYear: (year) => set((state) => ({
        timeSlider: { ...state.timeSlider, year: Math.max(state.timeSlider.range[0], Math.min(state.timeSlider.range[1], year)) }
      })),
      setPlaying: (playing) => set((state) => ({ timeSlider: { ...state.timeSlider, playing } })),
      setSpeed: (speed) => set((state) => ({ timeSlider: { ...state.timeSlider, speed: Math.max(0.25, Math.min(4, speed)) } })),
      setTimeRange: (range) => set((state) => ({ timeSlider: { ...state.timeSlider, range } })),
      setCamera: (camera) => set((state) => ({ camera: { ...state.camera, ...camera } })),
      setSidebarOpen: (open) => set((state) => ({ ui: { ...state.ui, sidebarOpen: open } })),
      setPanel: (panel) => set((state) => ({ ui: { ...state.ui, panel } })),
      setTheme: (theme) => set((state) => ({ ui: { ...state.ui, theme } })),
      resetView: () => set({
        selectedCountry: null,
        hoveredCountry: null,
        indicator: 'gdp_per_capita',
        timeSlider: DEFAULT_TIME_SLIDER,
        camera: DEFAULT_CAMERA,
        ui: DEFAULT_UI,
      }),
      nextYear: () => {
        const { timeSlider } = get();
        if (timeSlider.year < timeSlider.range[1]) {
          get().setYear(timeSlider.year + 1);
        }
      },
      prevYear: () => {
        const { timeSlider } = get();
        if (timeSlider.year > timeSlider.range[0]) {
          get().setYear(timeSlider.year - 1);
        }
      },
    }),
    {
      name: 'mundi-store',
      partialize: (state) => ({
        indicator: state.indicator,
        timeSlider: state.timeSlider,
        camera: state.camera,
        ui: { theme: state.ui.theme, sidebarOpen: state.ui.sidebarOpen },
      }),
    }
  )
);

// Selectors for performance
export const useSelectedCountry = () => useMundiStore((s) => s.selectedCountry);
export const useHoveredCountry = () => useMundiStore((s) => s.hoveredCountry);
export const useIndicator = () => useMundiStore((s) => s.indicator);
export const useTimeSlider = () => useMundiStore((s) => s.timeSlider);
export const useCamera = () => useMundiStore((s) => s.camera);
export const useUI = () => useMundiStore((s) => s.ui);
export const useSetSelectedCountry = () => useMundiStore((s) => s.setSelectedCountry);
export const useSetHoveredCountry = () => useMundiStore((s) => s.setHoveredCountry);
export const useSetIndicator = () => useMundiStore((s) => s.setIndicator);
export const useSetYear = () => useMundiStore((s) => s.setYear);
export const useSetPlaying = () => useMundiStore((s) => s.setPlaying);
export const useSetSpeed = () => useMundiStore((s) => s.setSpeed);
export const useSetCamera = () => useMundiStore((s) => s.setCamera);
export const useSetSidebarOpen = () => useMundiStore((s) => s.setSidebarOpen);
export const useSetPanel = () => useMundiStore((s) => s.setPanel);
export const useSetTheme = () => useMundiStore((s) => s.setTheme);
export const useResetView = () => useMundiStore((s) => s.resetView);
export const useNextYear = () => useMundiStore((s) => s.nextYear);
export const usePrevYear = () => useMundiStore((s) => s.prevYear);