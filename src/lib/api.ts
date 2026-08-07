import type { CountryData, IndicatorSeries, IndicatorValue, IndicatorId, CountryFullData } from '@/types';
import { COUNTRIES_META, INDICATORS_META, getIndicatorMeta } from '@/types';

// Mock data generator - produces realistic-looking data for demo
function generateMockSeries(countryCode: string, indicatorId: IndicatorId, years: number[]): IndicatorValue[] {
  const meta = getIndicatorMeta(indicatorId);
  if (!meta) return [];

  // Base values per country/indicator for realistic variation
  const countryHash = countryCode.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const indicatorHash = indicatorId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = (countryHash * 31 + indicatorHash) % 10000;

  const baseValues: Record<string, { base: number; trend: number; volatility: number }> = {
    gdp_per_capita: { base: 5000 + (seed % 50) * 1000, trend: 1.02, volatility: 0.05 },
    gdp_total: { base: 1e11 + (seed % 100) * 1e10, trend: 1.025, volatility: 0.04 },
    gini: { base: 30 + (seed % 30), trend: 0.999, volatility: 0.01 },
    unemployment: { base: 4 + (seed % 12), trend: 0.995, volatility: 0.1 },
    inflation: { base: 2 + (seed % 8), trend: 1.0, volatility: 0.3 },
    population_total: { base: 1e6 + (seed % 1000) * 1e6, trend: 1.01, volatility: 0.001 },
    population_growth: { base: 0.5 + (seed % 3), trend: 0.99, volatility: 0.05 },
    median_age: { base: 18 + (seed % 30), trend: 1.005, volatility: 0.01 },
    fertility_rate: { base: 1.2 + (seed % 4) * 0.5, trend: 0.99, volatility: 0.02 },
    urban_population: { base: 30 + (seed % 60), trend: 1.003, volatility: 0.005 },
    life_expectancy: { base: 55 + (seed % 30), trend: 1.002, volatility: 0.005 },
    child_mortality: { base: 5 + (seed % 80), trend: 0.96, volatility: 0.03 },
    maternal_mortality: { base: 10 + (seed % 500), trend: 0.97, volatility: 0.04 },
    health_expenditure: { base: 3 + (seed % 10), trend: 1.005, volatility: 0.02 },
    physicians_per_1000: { base: 0.5 + (seed % 30) * 0.1, trend: 1.01, volatility: 0.02 },
    literacy_rate: { base: 60 + (seed % 40), trend: 1.001, volatility: 0.002 },
    school_enrollment_primary: { base: 70 + (seed % 30), trend: 1.0005, volatility: 0.005 },
    school_enrollment_secondary: { base: 40 + (seed % 50), trend: 1.005, volatility: 0.01 },
    mean_years_schooling: { base: 4 + (seed % 10), trend: 1.01, volatility: 0.01 },
    education_expenditure: { base: 2 + (seed % 5), trend: 1.002, volatility: 0.02 },
    co2_emissions: { base: 0.5 + (seed % 20) * 0.5, trend: 1.005, volatility: 0.03 },
    forest_area: { base: 10 + (seed % 80), trend: 0.999, volatility: 0.002 },
    renewable_energy: { base: 5 + (seed % 60), trend: 1.02, volatility: 0.02 },
    air_pollution: { base: 5 + (seed % 50), trend: 0.995, volatility: 0.02 },
    protected_areas: { base: 5 + (seed % 30), trend: 1.005, volatility: 0.01 },
    democracy_index: { base: 3 + (seed % 7), trend: 1.0, volatility: 0.02 },
    corruption_perception: { base: 20 + (seed % 70), trend: 1.001, volatility: 0.01 },
    rule_of_law: { base: -1.5 + (seed % 40) * 0.1, trend: 1.001, volatility: 0.02 },
    press_freedom: { base: 20 + (seed % 70), trend: 0.999, volatility: 0.01 },
    government_effectiveness: { base: -1 + (seed % 35) * 0.1, trend: 1.001, volatility: 0.02 },
    internet_users: { base: 5 + (seed % 90), trend: 1.05, volatility: 0.03 },
    mobile_subscriptions: { base: 20 + (seed % 150), trend: 1.03, volatility: 0.02 },
    electricity_access: { base: 40 + (seed % 60), trend: 1.01, volatility: 0.01 },
    road_density: { base: 50 + (seed % 500), trend: 1.005, volatility: 0.01 },
    water_access: { base: 50 + (seed % 50), trend: 1.003, volatility: 0.005 },
    poverty_rate: { base: 2 + (seed % 60), trend: 0.97, volatility: 0.03 },
    hdi: { base: 0.4 + (seed % 55) * 0.01, trend: 1.003, volatility: 0.002 },
    gender_inequality: { base: 0.1 + (seed % 50) * 0.015, trend: 0.995, volatility: 0.005 },
    homicide_rate: { base: 0.5 + (seed % 50) * 0.2, trend: 0.99, volatility: 0.05 },
    social_protection: { base: 10 + (seed % 80), trend: 1.01, volatility: 0.02 },
  };

  const config = baseValues[indicatorId] || { base: 50, trend: 1.0, volatility: 0.05 };
  let value = config.base;

  return years.map((year, i) => {
    // Apply trend
    if (i > 0) {
      value *= config.trend;
    }
    // Add noise
    const noise = (Math.sin(year * 0.1 + seed) * 0.5 + Math.cos(year * 0.07 + seed * 1.3) * 0.5) * config.volatility;
    value *= (1 + noise);
    
    // Clamp to reasonable bounds per indicator
    if (indicatorId === 'gini') value = Math.max(20, Math.min(65, value));
    if (indicatorId === 'unemployment') value = Math.max(0.5, Math.min(35, value));
    if (indicatorId === 'inflation') value = Math.max(-5, Math.min(1000, value));
    if (indicatorId === 'urban_population') value = Math.max(10, Math.min(100, value));
    if (indicatorId === 'literacy_rate') value = Math.max(10, Math.min(100, value));
    if (indicatorId === 'school_enrollment_primary') value = Math.max(20, Math.min(110, value));
    if (indicatorId === 'school_enrollment_secondary') value = Math.max(10, Math.min(110, value));
    if (indicatorId === 'renewable_energy') value = Math.max(0, Math.min(100, value));
    if (indicatorId === 'internet_users') value = Math.max(0, Math.min(100, value));
    if (indicatorId === 'electricity_access') value = Math.max(0, Math.min(100, value));
    if (indicatorId === 'water_access') value = Math.max(0, Math.min(100, value));
    if (indicatorId === 'hdi') value = Math.max(0.2, Math.min(1, value));
    if (indicatorId === 'gender_inequality') value = Math.max(0.02, Math.min(0.8, value));
    if (indicatorId === 'corruption_perception') value = Math.max(10, Math.min(95, value));
    if (indicatorId === 'press_freedom') value = Math.max(5, Math.min(95, value));
    if (indicatorId === 'democracy_index') value = Math.max(1, Math.min(10, value));

    return {
      year,
      value: Math.round(value * 100) / 100,
      unit: meta.unit,
      source: meta.source,
    };
  });
}

// Cache for generated data
const dataCache = new Map<string, Record<string, IndicatorSeries>>();

export async function fetchCountryData(countryCode: string): Promise<CountryFullData | null> {
  const country = COUNTRIES_META.find(c => c.code === countryCode);
  if (!country) return null;

  const cacheKey = `country-${countryCode}`;
  if (dataCache.has(cacheKey)) {
    return { ...country, indicators: dataCache.get(cacheKey)!, metadata: { dataQuality: 'alta', lastFetch: new Date().toISOString(), sources: ['Mock Data (Demo)'] } };
  }

  const years = Array.from({ length: 65 }, (_, i) => 1960 + i);
  const indicators: Record<string, IndicatorSeries> = {};

  for (const meta of INDICATORS_META) {
    const values = generateMockSeries(countryCode, meta.id, years);
    indicators[meta.id] = {
      indicatorId: meta.id,
      indicatorName: meta.name,
      indicatorNameEn: meta.nameEn,
      category: meta.category,
      unit: meta.unit,
      description: `${meta.name} para ${country.name} (fonte: ${meta.source})`,
      values,
      lastUpdated: new Date().toISOString(),
    };
  }

  dataCache.set(cacheKey, indicators);

  return {
    ...country,
    indicators,
    metadata: {
      dataQuality: 'alta',
      lastFetch: new Date().toISOString(),
      sources: ['World Bank (mock)', 'UN (mock)', 'WHO (mock)', 'Demo Data'],
    },
  };
}

export async function fetchIndicatorForAllCountries(indicatorId: string, year: number): Promise<Map<string, number | null>> {
  const result = new Map<string, number | null>();
  const years = [year];
  
  for (const country of COUNTRIES_META) {
    const series = generateMockSeries(country.code, indicatorId as IndicatorId, years);
    result.set(country.code, series[0]?.value ?? null);
  }
  
  return result;
}

export async function fetchTimeSeriesForCountry(countryCode: string, indicatorId: string): Promise<IndicatorValue[]> {
  const years = Array.from({ length: 65 }, (_, i) => 1960 + i);
  return generateMockSeries(countryCode, indicatorId as IndicatorId, years);
}

export function getCountries(): CountryData[] {
  return COUNTRIES_META;
}

export function getCountriesByRegion(region: string): CountryData[] {
  return COUNTRIES_META.filter(c => c.region === region);
}

export function searchCountries(query: string): CountryData[] {
  const q = query.toLowerCase();
  return COUNTRIES_META.filter(c => 
    c.name.toLowerCase().includes(q) ||
    c.nameEn.toLowerCase().includes(q) ||
    c.code.toLowerCase().includes(q)
  );
}

// Real API integration points (to be implemented)
export const REAL_API_ENDPOINTS = {
  worldBank: 'https://api.worldbank.org/v2',
  unData: 'https://population.un.org/dataportalapi/api/v1',
  who: 'https://ghoapi.azureedge.net/api',
  fao: 'https://fenixservices.fao.org/faostat/api/v1',
  imf: 'https://www.imf.org/external/datamapper/api/v1',
  oecd: 'https://stats.oecd.org/SDMX-JSON/data',
  ourWorldInData: 'https://ourworldindata.org/grapher',
} as const;

export async function fetchRealWorldBankIndicator(countryCode: string, indicatorCode: string): Promise<IndicatorValue[]> {
  // Placeholder for real implementation
  // const url = `${REAL_API_ENDPOINTS.worldBank}/country/${countryCode}/indicator/${indicatorCode}?format=json&per_page=1000`;
  // const response = await fetch(url);
  // const data = await response.json();
  // return parseWorldBankResponse(data);
  return [];
}

export async function fetchRealUNPopulation(countryCode: string): Promise<IndicatorValue[]> {
  // Placeholder
  return [];
}