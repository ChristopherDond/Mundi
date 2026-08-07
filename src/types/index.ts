export interface CountryData {
  code: string;           // ISO-3 (BRA, USA, CHN)
  name: string;           // Nome em PT-BR
  nameEn: string;         // Nome em inglês
  region: string;         // Região (América do Sul, Europa, etc.)
  subregion: string;      // Sub-região
  capital: string;
  coordinates: [number, number]; // [lon, lat]
  area: number;           // km²
  population: number;
  flag: string;           // Emoji ou URL
  flagUrl: string;        // URL da bandeira
}

export interface IndicatorValue {
  year: number;
  value: number | null;
  unit: string;
  source: string;
}

export interface IndicatorSeries {
  indicatorId: string;
  indicatorName: string;
  indicatorNameEn: string;
  category: IndicatorCategory;
  unit: string;
  description: string;
  values: IndicatorValue[];
  lastUpdated: string;
}

export type IndicatorCategory = 
  | 'economico'
  | 'demografico'
  | 'saude'
  | 'educacao'
  | 'meio_ambiente'
  | 'governanca'
  | 'infraestrutura'
  | 'social';

export interface CountryFullData extends CountryData {
  indicators: Record<string, IndicatorSeries>;
  metadata: {
    dataQuality: 'alta' | 'media' | 'baixa';
    lastFetch: string;
    sources: string[];
  };
}

export interface GlobeCountryProps {
  code: string;
  name: string;
  value: number | null;
  color: string;
  height: number;
  isHovered: boolean;
  isSelected: boolean;
}

export interface TimeSliderState {
  year: number;
  playing: boolean;
  speed: number; // anos por segundo
  range: [number, number];
}

export interface ViewState {
  selectedCountry: string | null;
  hoveredCountry: string | null;
  indicator: string | null;
  timeSlider: TimeSliderState;
  camera: {
    longitude: number;
    latitude: number;
    height: number;
    heading: number;
    pitch: number;
    roll: number;
  };
  ui: {
    sidebarOpen: boolean;
    panel: 'indicators' | 'country' | 'compare' | 'settings';
    theme: 'dark' | 'light';
  };
}

export const INDICATOR_CATEGORIES: Record<IndicatorCategory, { label: string; icon: string; color: string }> = {
  economico: { label: 'Econômico', icon: 'dollar-sign', color: '#22c55e' },
  demografico: { label: 'Demográfico', icon: 'users', color: '#3b82f6' },
  saude: { label: 'Saúde', icon: 'heart-pulse', color: '#ef4444' },
  educacao: { label: 'Educação', icon: 'graduation-cap', color: '#f59e0b' },
  meio_ambiente: { label: 'Meio Ambiente', icon: 'leaf', color: '#10b981' },
  governanca: { label: 'Governança', icon: 'scale', color: '#8b5cf6' },
  infraestrutura: { label: 'Infraestrutura', icon: 'building-2', color: '#64748b' },
  social: { label: 'Social', icon: 'hand-heart', color: '#ec4899' },
};

export const INDICATORS_META = [
  // Econômico
  { id: 'gdp_per_capita', name: 'PIB per capita', nameEn: 'GDP per capita', category: 'economico' as IndicatorCategory, unit: 'US$ (2015)', source: 'World Bank' },
  { id: 'gdp_total', name: 'PIB total', nameEn: 'GDP (current US$)', category: 'economico' as IndicatorCategory, unit: 'US$', source: 'World Bank' },
  { id: 'gini', name: 'Coeficiente de Gini', nameEn: 'Gini coefficient', category: 'economico' as IndicatorCategory, unit: 'Índice (0-100)', source: 'World Bank' },
  { id: 'unemployment', name: 'Desemprego', nameEn: 'Unemployment rate', category: 'economico' as IndicatorCategory, unit: '%', source: 'World Bank' },
  { id: 'inflation', name: 'Inflação', nameEn: 'Inflation rate', category: 'economico' as IndicatorCategory, unit: '%', source: 'World Bank' },
  
  // Demográfico
  { id: 'population_total', name: 'População total', nameEn: 'Total population', category: 'demografico' as IndicatorCategory, unit: 'Habitantes', source: 'UN' },
  { id: 'population_growth', name: 'Crescimento populacional', nameEn: 'Population growth', category: 'demografico' as IndicatorCategory, unit: '% ao ano', source: 'UN' },
  { id: 'median_age', name: 'Idade média', nameEn: 'Median age', category: 'demografico' as IndicatorCategory, unit: 'Anos', source: 'UN' },
  { id: 'fertility_rate', name: 'Taxa de fecundidade', nameEn: 'Fertility rate', category: 'demografico' as IndicatorCategory, unit: 'Filhos por mulher', source: 'UN' },
  { id: 'urban_population', name: 'População urbana', nameEn: 'Urban population', category: 'demografico' as IndicatorCategory, unit: '%', source: 'World Bank' },
  
  // Saúde
  { id: 'life_expectancy', name: 'Expectativa de vida', nameEn: 'Life expectancy', category: 'saude' as IndicatorCategory, unit: 'Anos', source: 'WHO' },
  { id: 'child_mortality', name: 'Mortalidade infantil', nameEn: 'Child mortality', category: 'saude' as IndicatorCategory, unit: 'Por 1.000 nascidos', source: 'WHO' },
  { id: 'maternal_mortality', name: 'Mortalidade materna', nameEn: 'Maternal mortality', category: 'saude' as IndicatorCategory, unit: 'Por 100.000 nascidos', source: 'WHO' },
  { id: 'health_expenditure', name: 'Gasto em saúde (% PIB)', nameEn: 'Health expenditure (% GDP)', category: 'saude' as IndicatorCategory, unit: '%', source: 'WHO' },
  { id: 'physicians_per_1000', name: 'Médicos por 1.000 hab.', nameEn: 'Physicians per 1,000', category: 'saude' as IndicatorCategory, unit: 'Por 1.000', source: 'WHO' },
  
  // Educação
  { id: 'literacy_rate', name: 'Taxa de alfabetização', nameEn: 'Literacy rate', category: 'educacao' as IndicatorCategory, unit: '%', source: 'UNESCO' },
  { id: 'school_enrollment_primary', name: 'Matrícula no primário', nameEn: 'Primary enrollment', category: 'educacao' as IndicatorCategory, unit: '%', source: 'UNESCO' },
  { id: 'school_enrollment_secondary', name: 'Matrícula no secundário', nameEn: 'Secondary enrollment', category: 'educacao' as IndicatorCategory, unit: '%', source: 'UNESCO' },
  { id: 'mean_years_schooling', name: 'Anos médios de estudo', nameEn: 'Mean years of schooling', category: 'educacao' as IndicatorCategory, unit: 'Anos', source: 'UNDP' },
  { id: 'education_expenditure', name: 'Gasto em educação (% PIB)', nameEn: 'Education expenditure (% GDP)', category: 'educacao' as IndicatorCategory, unit: '%', source: 'World Bank' },
  
  // Meio Ambiente
  { id: 'co2_emissions', name: 'Emissões CO₂ per capita', nameEn: 'CO2 emissions per capita', category: 'meio_ambiente' as IndicatorCategory, unit: 'Toneladas', source: 'Global Carbon Atlas' },
  { id: 'forest_area', name: 'Área florestal', nameEn: 'Forest area', category: 'meio_ambiente' as IndicatorCategory, unit: '% do território', source: 'FAO' },
  { id: 'renewable_energy', name: 'Energia renovável', nameEn: 'Renewable energy', category: 'meio_ambiente' as IndicatorCategory, unit: '% do consumo', source: 'IEA' },
  { id: 'air_pollution', name: 'Poluição do ar (PM2.5)', nameEn: 'Air pollution (PM2.5)', category: 'meio_ambiente' as IndicatorCategory, unit: 'µg/m³', source: 'WHO' },
  { id: 'protected_areas', name: 'Áreas protegidas', nameEn: 'Protected areas', category: 'meio_ambiente' as IndicatorCategory, unit: '% do território', source: 'UNEP' },
  
  // Governança
  { id: 'democracy_index', name: 'Índice de democracia', nameEn: 'Democracy index', category: 'governanca' as IndicatorCategory, unit: 'Índice (0-10)', source: 'EIU' },
  { id: 'corruption_perception', name: 'Percepção de corrupção', nameEn: 'Corruption perception', category: 'governanca' as IndicatorCategory, unit: 'Índice (0-100)', source: 'Transparency Intl' },
  { id: 'rule_of_law', name: 'Estado de direito', nameEn: 'Rule of law', category: 'governanca' as IndicatorCategory, unit: 'Índice (-2.5 a 2.5)', source: 'World Bank' },
  { id: 'press_freedom', name: 'Liberdade de imprensa', nameEn: 'Press freedom', category: 'governanca' as IndicatorCategory, unit: 'Score (0-100)', source: 'RSF' },
  { id: 'government_effectiveness', name: 'Efetividade do governo', nameEn: 'Government effectiveness', category: 'governanca' as IndicatorCategory, unit: 'Índice (-2.5 a 2.5)', source: 'World Bank' },
  
  // Infraestrutura
  { id: 'internet_users', name: 'Usuários de internet', nameEn: 'Internet users', category: 'infraestrutura' as IndicatorCategory, unit: '% da população', source: 'ITU' },
  { id: 'mobile_subscriptions', name: 'Assinaturas móveis', nameEn: 'Mobile subscriptions', category: 'infraestrutura' as IndicatorCategory, unit: 'Por 100 hab.', source: 'ITU' },
  { id: 'electricity_access', name: 'Acesso à eletricidade', nameEn: 'Electricity access', category: 'infraestrutura' as IndicatorCategory, unit: '% da população', source: 'World Bank' },
  { id: 'road_density', name: 'Densidade de estradas', nameEn: 'Road density', category: 'infraestrutura' as IndicatorCategory, unit: 'km/100 km²', source: 'World Bank' },
  { id: 'water_access', name: 'Acesso à água potável', nameEn: 'Water access', category: 'infraestrutura' as IndicatorCategory, unit: '% da população', source: 'WHO/UNICEF' },
  
  // Social
  { id: 'poverty_rate', name: 'Taxa de pobreza', nameEn: 'Poverty rate', category: 'social' as IndicatorCategory, unit: '% (linha US$ 2.15)', source: 'World Bank' },
  { id: 'hdi', name: 'IDH', nameEn: 'Human Development Index', category: 'social' as IndicatorCategory, unit: 'Índice (0-1)', source: 'UNDP' },
  { id: 'gender_inequality', name: 'Desigualdade de gênero', nameEn: 'Gender inequality', category: 'social' as IndicatorCategory, unit: 'Índice (0-1)', source: 'UNDP' },
  { id: 'homicide_rate', name: 'Taxa de homicídios', nameEn: 'Homicide rate', category: 'social' as IndicatorCategory, unit: 'Por 100.000 hab.', source: 'UNODC' },
  { id: 'social_protection', name: 'Proteção social', nameEn: 'Social protection', category: 'social' as IndicatorCategory, unit: '% da população', source: 'ILO' },
] as const;

export type IndicatorId = typeof INDICATORS_META[number]['id'];

export function getIndicatorMeta(id: string) {
  return INDICATORS_META.find(m => m.id === id);
}

export function getIndicatorsByCategory(category: IndicatorCategory) {
  return INDICATORS_META.filter(m => m.category === category);
}

export const COUNTRIES_META: CountryData[] = [
  { code: 'BRA', name: 'Brasil', nameEn: 'Brazil', region: 'América do Sul', subregion: 'América do Sul', capital: 'Brasília', coordinates: [-47.9292, -15.7801], area: 8515767, population: 215313498, flag: '🇧🇷', flagUrl: 'https://flagcdn.com/w320/br.png' },
  { code: 'USA', name: 'Estados Unidos', nameEn: 'United States', region: 'América do Norte', subregion: 'América do Norte', capital: 'Washington, D.C.', coordinates: [-98.5795, 39.8283], area: 9833517, population: 339996563, flag: '🇺🇸', flagUrl: 'https://flagcdn.com/w320/us.png' },
  { code: 'CHN', name: 'China', nameEn: 'China', region: 'Ásia', subregion: 'Ásia Oriental', capital: 'Pequim', coordinates: [104.1954, 35.8617], area: 9596961, population: 1425671352, flag: '🇨🇳', flagUrl: 'https://flagcdn.com/w320/cn.png' },
  { code: 'IND', name: 'Índia', nameEn: 'India', region: 'Ásia', subregion: 'Ásia Meridional', capital: 'Nova Déli', coordinates: [78.9629, 20.5937], area: 3287263, population: 1428627663, flag: '🇮🇳', flagUrl: 'https://flagcdn.com/w320/in.png' },
  { code: 'RUS', name: 'Rússia', nameEn: 'Russia', region: 'Europa/Ásia', subregion: 'Europa Oriental', capital: 'Moscou', coordinates: [105.3188, 61.524], area: 17098246, population: 144444359, flag: '🇷🇺', flagUrl: 'https://flagcdn.com/w320/ru.png' },
  { code: 'JPN', name: 'Japão', nameEn: 'Japan', region: 'Ásia', subregion: 'Ásia Oriental', capital: 'Tóquio', coordinates: [138.2529, 36.2048], area: 377975, population: 123294513, flag: '🇯🇵', flagUrl: 'https://flagcdn.com/w320/jp.png' },
  { code: 'DEU', name: 'Alemanha', nameEn: 'Germany', region: 'Europa', subregion: 'Europa Ocidental', capital: 'Berlim', coordinates: [10.4515, 51.1657], area: 357386, population: 83294633, flag: '🇩🇪', flagUrl: 'https://flagcdn.com/w320/de.png' },
  { code: 'GBR', name: 'Reino Unido', nameEn: 'United Kingdom', region: 'Europa', subregion: 'Europa Setentrional', capital: 'Londres', coordinates: [-3.436, 55.3781], area: 243610, population: 67736802, flag: '🇬🇧', flagUrl: 'https://flagcdn.com/w320/gb.png' },
  { code: 'FRA', name: 'França', nameEn: 'France', region: 'Europa', subregion: 'Europa Ocidental', capital: 'Paris', coordinates: [2.2137, 46.2276], area: 551695, population: 68042591, flag: '🇫🇷', flagUrl: 'https://flagcdn.com/w320/fr.png' },
  { code: 'ITA', name: 'Itália', nameEn: 'Italy', region: 'Europa', subregion: 'Europa Meridional', capital: 'Roma', coordinates: [12.5674, 41.8719], area: 301340, population: 58870762, flag: '🇮🇹', flagUrl: 'https://flagcdn.com/w320/it.png' },
  { code: 'CAN', name: 'Canadá', nameEn: 'Canada', region: 'América do Norte', subregion: 'América do Norte', capital: 'Ottawa', coordinates: [-106.3468, 56.1304], area: 9984670, population: 38781291, flag: '🇨🇦', flagUrl: 'https://flagcdn.com/w320/ca.png' },
  { code: 'AUS', name: 'Austrália', nameEn: 'Australia', region: 'Oceania', subregion: 'Austrália e Nova Zelândia', capital: 'Camberra', coordinates: [133.7751, -25.2744], area: 7692024, population: 26439111, flag: '🇦🇺', flagUrl: 'https://flagcdn.com/w320/au.png' },
  { code: 'MEX', name: 'México', nameEn: 'Mexico', region: 'América do Norte', subregion: 'América Latina', capital: 'Cidade do México', coordinates: [-102.5528, 23.6345], area: 1964375, population: 128455567, flag: '🇲🇽', flagUrl: 'https://flagcdn.com/w320/mx.png' },
  { code: 'KOR', name: 'Coreia do Sul', nameEn: 'South Korea', region: 'Ásia', subregion: 'Ásia Oriental', capital: 'Seul', coordinates: [127.7669, 35.9078], area: 100210, population: 51784059, flag: '🇰🇷', flagUrl: 'https://flagcdn.com/w320/kr.png' },
  { code: 'ESP', name: 'Espanha', nameEn: 'Spain', region: 'Europa', subregion: 'Europa Meridional', capital: 'Madrid', coordinates: [-3.7492, 40.4637], area: 505990, population: 47519628, flag: '🇪🇸', flagUrl: 'https://flagcdn.com/w320/es.png' },
  { code: 'IDN', name: 'Indonésia', nameEn: 'Indonesia', region: 'Ásia', subregion: 'Sudeste Asiático', capital: 'Jacarta', coordinates: [113.9213, -0.7893], area: 1904569, population: 277534122, flag: '🇮🇩', flagUrl: 'https://flagcdn.com/w320/id.png' },
  { code: 'SAU', name: 'Arábia Saudita', nameEn: 'Saudi Arabia', region: 'Ásia', subregion: 'Ásia Ocidental', capital: 'Riade', coordinates: [45.0792, 23.8859], area: 2149690, population: 36947025, flag: '🇸🇦', flagUrl: 'https://flagcdn.com/w320/sa.png' },
  { code: 'TUR', name: 'Turquia', nameEn: 'Turkey', region: 'Ásia/Europa', subregion: 'Ásia Ocidental', capital: 'Ancara', coordinates: [35.2433, 38.9637], area: 783562, population: 85372377, flag: '🇹🇷', flagUrl: 'https://flagcdn.com/w320/tr.png' },
  { code: 'ARG', name: 'Argentina', nameEn: 'Argentina', region: 'América do Sul', subregion: 'América do Sul', capital: 'Buenos Aires', coordinates: [-63.6167, -38.4161], area: 2780400, population: 45773884, flag: '🇦🇷', flagUrl: 'https://flagcdn.com/w320/ar.png' },
  { code: 'ZAF', name: 'África do Sul', nameEn: 'South Africa', region: 'África', subregion: 'África Austral', capital: 'Pretória', coordinates: [22.9375, -30.5595], area: 1221037, population: 60442647, flag: '🇿🇦', flagUrl: 'https://flagcdn.com/w320/za.png' },
  { code: 'NGA', name: 'Nigéria', nameEn: 'Nigeria', region: 'África', subregion: 'África Ocidental', capital: 'Abuja', coordinates: [8.6753, 9.082], area: 923768, population: 223804632, flag: '🇳🇬', flagUrl: 'https://flagcdn.com/w320/ng.png' },
  { code: 'EGY', name: 'Egito', nameEn: 'Egypt', region: 'África', subregion: 'África Setentrional', capital: 'Cairo', coordinates: [29.5333, 26.8206], area: 1002450, population: 112716598, flag: '🇪🇬', flagUrl: 'https://flagcdn.com/w320/eg.png' },
  { code: 'PAK', name: 'Paquistão', nameEn: 'Pakistan', region: 'Ásia', subregion: 'Ásia Meridional', capital: 'Islamabade', coordinates: [69.3451, 30.3753], area: 881912, population: 240485658, flag: '🇵🇰', flagUrl: 'https://flagcdn.com/w320/pk.png' },
  { code: 'BGD', name: 'Bangladesh', nameEn: 'Bangladesh', region: 'Ásia', subregion: 'Ásia Meridional', capital: 'Daca', coordinates: [90.3563, 23.685], area: 147570, population: 172954319, flag: '🇧🇩', flagUrl: 'https://flagcdn.com/w320/bd.png' },
  { code: 'VNM', name: 'Vietnã', nameEn: 'Vietnam', region: 'Ásia', subregion: 'Sudeste Asiático', capital: 'Hanói', coordinates: [108.2772, 14.0583], area: 331212, population: 98858950, flag: '🇻🇳', flagUrl: 'https://flagcdn.com/w320/vn.png' },
  { code: 'POL', name: 'Polônia', nameEn: 'Poland', region: 'Europa', subregion: 'Europa Oriental', capital: 'Varsóvia', coordinates: [19.1451, 51.9194], area: 312685, population: 41026067, flag: '🇵🇱', flagUrl: 'https://flagcdn.com/w320/pl.png' },
  { code: 'NLD', name: 'Países Baixos', nameEn: 'Netherlands', region: 'Europa', subregion: 'Europa Ocidental', capital: 'Amsterdã', coordinates: [5.2913, 52.1326], area: 41850, population: 17618299, flag: '🇳🇱', flagUrl: 'https://flagcdn.com/w320/nl.png' },
  { code: 'SWE', name: 'Suécia', nameEn: 'Sweden', region: 'Europa', subregion: 'Europa Setentrional', capital: 'Estocolmo', coordinates: [18.6435, 60.1282], area: 450295, population: 10612086, flag: '🇸🇪', flagUrl: 'https://flagcdn.com/w320/se.png' },
  { code: 'NOR', name: 'Noruega', nameEn: 'Norway', region: 'Europa', subregion: 'Europa Setentrional', capital: 'Oslo', coordinates: [8.4689, 60.472], area: 385207, population: 5474360, flag: '🇳🇴', flagUrl: 'https://flagcdn.com/w320/no.png' },
  { code: 'CHE', name: 'Suíça', nameEn: 'Switzerland', region: 'Europa', subregion: 'Europa Ocidental', capital: 'Berna', coordinates: [8.2275, 46.8182], area: 41284, population: 8796669, flag: '🇨🇭', flagUrl: 'https://flagcdn.com/w320/ch.png' },
  { code: 'BEL', name: 'Bélgica', nameEn: 'Belgium', region: 'Europa', subregion: 'Europa Ocidental', capital: 'Bruxelas', coordinates: [4.4699, 50.5039], area: 30528, population: 11686140, flag: '🇧🇪', flagUrl: 'https://flagcdn.com/w320/be.png' },
  { code: 'AUT', name: 'Áustria', nameEn: 'Austria', region: 'Europa', subregion: 'Europa Ocidental', capital: 'Viena', coordinates: [14.5501, 47.5162], area: 83879, population: 9041559, flag: '🇦🇹', flagUrl: 'https://flagcdn.com/w320/at.png' },
  { code: 'ISR', name: 'Israel', nameEn: 'Israel', region: 'Ásia', subregion: 'Ásia Ocidental', capital: 'Jerusalém', coordinates: [34.8516, 31.0461], area: 22072, population: 9311652, flag: '🇮🇱', flagUrl: 'https://flagcdn.com/w320/il.png' },
  { code: 'SGP', name: 'Singapura', nameEn: 'Singapore', region: 'Ásia', subregion: 'Sudeste Asiático', capital: 'Singapura', coordinates: [103.8198, 1.3521], area: 728, population: 5917600, flag: '🇸🇬', flagUrl: 'https://flagcdn.com/w320/sg.png' },
  { code: 'ARE', name: 'Emirados Árabes Unidos', nameEn: 'UAE', region: 'Ásia', subregion: 'Ásia Ocidental', capital: 'Abu Dhabi', coordinates: [53.8478, 23.4241], area: 83600, population: 9516871, flag: '🇦🇪', flagUrl: 'https://flagcdn.com/w320/ae.png' },
  { code: 'QAT', name: 'Catar', nameEn: 'Qatar', region: 'Ásia', subregion: 'Ásia Ocidental', capital: 'Doha', coordinates: [51.1839, 25.3548], area: 11586, population: 2716391, flag: '🇶🇦', flagUrl: 'https://flagcdn.com/w320/qa.png' },
  { code: 'NZL', name: 'Nova Zelândia', nameEn: 'New Zealand', region: 'Oceania', subregion: 'Austrália e Nova Zelândia', capital: 'Wellington', coordinates: [174.886, -40.9006], area: 270467, population: 5228100, flag: '🇳🇿', flagUrl: 'https://flagcdn.com/w320/nz.png' },
  { code: 'IRL', name: 'Irlanda', nameEn: 'Ireland', region: 'Europa', subregion: 'Europa Setentrional', capital: 'Dublin', coordinates: [-8.2439, 53.4129], area: 70273, population: 5033165, flag: '🇮🇪', flagUrl: 'https://flagcdn.com/w320/ie.png' },
  { code: 'FIN', name: 'Finlândia', nameEn: 'Finland', region: 'Europa', subregion: 'Europa Setentrional', capital: 'Helsinque', coordinates: [25.7482, 61.9241], area: 338455, population: 5545475, flag: '🇫🇮', flagUrl: 'https://flagcdn.com/w320/fi.png' },
  { code: 'DNK', name: 'Dinamarca', nameEn: 'Denmark', region: 'Europa', subregion: 'Europa Setentrional', capital: 'Copenhague', coordinates: [9.5018, 56.2639], area: 43094, population: 5882261, flag: '🇩🇰', flagUrl: 'https://flagcdn.com/w320/dk.png' },
  { code: 'PRT', name: 'Portugal', nameEn: 'Portugal', region: 'Europa', subregion: 'Europa Meridional', capital: 'Lisboa', coordinates: [-8.2245, 39.3999], area: 92212, population: 10467366, flag: '🇵🇹', flagUrl: 'https://flagcdn.com/w320/pt.png' },
  { code: 'GRC', name: 'Grécia', nameEn: 'Greece', region: 'Europa', subregion: 'Europa Meridional', capital: 'Atenas', coordinates: [21.8243, 39.0742], area: 131957, population: 10341277, flag: '🇬🇷', flagUrl: 'https://flagcdn.com/w320/gr.png' },
  { code: 'COL', name: 'Colômbia', nameEn: 'Colombia', region: 'América do Sul', subregion: 'América do Sul', capital: 'Bogotá', coordinates: [-74.2973, 4.5709], area: 1141748, population: 52085168, flag: '🇨🇴', flagUrl: 'https://flagcdn.com/w320/co.png' },
  { code: 'CHL', name: 'Chile', nameEn: 'Chile', region: 'América do Sul', subregion: 'América do Sul', capital: 'Santiago', coordinates: [-71.543, -35.6751], area: 756102, population: 19629590, flag: '🇨🇱', flagUrl: 'https://flagcdn.com/w320/cl.png' },
  { code: 'PER', name: 'Peru', nameEn: 'Peru', region: 'América do Sul', subregion: 'América do Sul', capital: 'Lima', coordinates: [-75.0152, -9.19], area: 1285216, population: 34352719, flag: '🇵🇪', flagUrl: 'https://flagcdn.com/w320/pe.png' },
  { code: 'ECU', name: 'Equador', nameEn: 'Ecuador', region: 'América do Sul', subregion: 'América do Sul', capital: 'Quito', coordinates: [-78.1834, -1.8312], area: 276841, population: 18190484, flag: '🇪🇨', flagUrl: 'https://flagcdn.com/w320/ec.png' },
  { code: 'VEN', name: 'Venezuela', nameEn: 'Venezuela', region: 'América do Sul', subregion: 'América do Sul', capital: 'Caracas', coordinates: [-66.5897, 6.4238], area: 916445, population: 28838499, flag: '🇻🇪', flagUrl: 'https://flagcdn.com/w320/ve.png' },
  { code: 'CUB', name: 'Cuba', nameEn: 'Cuba', region: 'América do Norte', subregion: 'Caribe', capital: 'Havana', coordinates: [-78.6569, 21.5218], area: 109884, population: 11194449, flag: '🇨🇺', flagUrl: 'https://flagcdn.com/w320/cu.png' },
  { code: 'MAR', name: 'Marrocos', nameEn: 'Morocco', region: 'África', subregion: 'África Setentrional', capital: 'Rabat', coordinates: [-7.0926, 31.7917], area: 446550, population: 37840044, flag: '🇲🇦', flagUrl: 'https://flagcdn.com/w320/ma.png' },
  { code: 'DZA', name: 'Argélia', nameEn: 'Algeria', region: 'África', subregion: 'África Setentrional', capital: 'Argel', coordinates: [1.6596, 28.0339], area: 2381741, population: 45606480, flag: '🇩🇿', flagUrl: 'https://flagcdn.com/w320/dz.png' },
  { code: 'TUN', name: 'Tunísia', nameEn: 'Tunisia', region: 'África', subregion: 'África Setentrional', capital: 'Tunes', coordinates: [9.5375, 33.8869], area: 163610, population: 12458223, flag: '🇹🇳', flagUrl: 'https://flagcdn.com/w320/tn.png' },
  { code: 'GHA', name: 'Gana', nameEn: 'Ghana', region: 'África', subregion: 'África Ocidental', capital: 'Acra', coordinates: [-1.0232, 7.9465], area: 238533, population: 34121985, flag: '🇬🇭', flagUrl: 'https://flagcdn.com/w320/gh.png' },
  { code: 'KEN', name: 'Quênia', nameEn: 'Kenya', region: 'África', subregion: 'África Oriental', capital: 'Nairóbi', coordinates: [37.9062, -0.0236], area: 580367, population: 55100586, flag: '🇰🇪', flagUrl: 'https://flagcdn.com/w320/ke.png' },
  { code: 'ETH', name: 'Etiópia', nameEn: 'Ethiopia', region: 'África', subregion: 'África Oriental', capital: 'Adis Abeba', coordinates: [40.4897, 9.145], area: 1104300, population: 126527060, flag: '🇪🇹', flagUrl: 'https://flagcdn.com/w320/et.png' },
  { code: 'TZA', name: 'Tanzânia', nameEn: 'Tanzania', region: 'África', subregion: 'África Oriental', capital: 'Dodoma', coordinates: [34.8888, -6.369], area: 947300, population: 67438106, flag: '🇹🇿', flagUrl: 'https://flagcdn.com/w320/tz.png' },
  { code: 'UGA', name: 'Uganda', nameEn: 'Uganda', region: 'África', subregion: 'África Oriental', capital: 'Kampala', coordinates: [32.2903, 1.3733], area: 241038, population: 48582334, flag: '🇺🇬', flagUrl: 'https://flagcdn.com/w320/ug.png' },
  { code: 'CIV', name: 'Costa do Marfim', nameEn: "Ivory Coast", region: 'África', subregion: 'África Ocidental', capital: 'Yamoussoukro', coordinates: [-5.5471, 7.54], area: 322463, population: 28873034, flag: '🇨🇮', flagUrl: 'https://flagcdn.com/w320/ci.png' },
  { code: 'SEN', name: 'Senegal', nameEn: 'Senegal', region: 'África', subregion: 'África Ocidental', capital: 'Dacar', coordinates: [-14.4974, 14.4974], area: 196722, population: 17763163, flag: '🇸🇳', flagUrl: 'https://flagcdn.com/w320/sn.png' },
  { code: 'CMR', name: 'Camarões', nameEn: 'Cameroon', region: 'África', subregion: 'África Central', capital: 'Iaundé', coordinates: [12.3547, 3.848], area: 475442, population: 28647293, flag: '🇨🇲', flagUrl: 'https://flagcdn.com/w320/cm.png' },
  { code: 'COD', name: 'RD Congo', nameEn: 'DR Congo', region: 'África', subregion: 'África Central', capital: 'Kinshasa', coordinates: [21.7587, -4.0383], area: 2344858, population: 102262808, flag: '🇨🇩', flagUrl: 'https://flagcdn.com/w320/cd.png' },
  { code: 'AGO', name: 'Angola', nameEn: 'Angola', region: 'África', subregion: 'África Central', capital: 'Luanda', coordinates: [17.8739, -11.2027], area: 1246700, population: 36684202, flag: '🇦🇴', flagUrl: 'https://flagcdn.com/w320/ao.png' },
];

export function getCountryByCode(code: string) {
  return COUNTRIES_META.find(c => c.code === code);
}

export function getAllCountries() {
  return COUNTRIES_META;
}

export const REGIONS = [
  'América do Sul', 'América do Norte', 'Ásia', 'Europa', 'África', 'Oceania',
  'Ásia/Europa', 'Ásia/África', 'Europa/Ásia', 'África/Ásia'
] as const;

export const SUBREGIONS = [
  'América do Sul', 'América do Norte', 'América Latina', 'Caribe',
  'Ásia Oriental', 'Sudeste Asiático', 'Ásia Meridional', 'Ásia Ocidental', 'Ásia Central',
  'Europa Ocidental', 'Europa Oriental', 'Europa Setentrional', 'Europa Meridional',
  'África Setentrional', 'África Ocidental', 'África Oriental', 'África Central', 'África Austral',
  'Austrália e Nova Zelândia', 'Melanésia', 'Micronésia', 'Polinésia'
] as const;