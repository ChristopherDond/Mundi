'use client';

import * as React from 'react';
import { Viewer, Entity, Globe as CesiumGlobe } from 'resium';
import { Color, Cartesian3 } from 'cesium';
import type { CountryData } from '@/types';
import { useMundiStore, useSelectedCountry, useHoveredCountry, useIndicator, useTimeSlider, useSetSelectedCountry, useSetHoveredCountry, useSetCamera } from '@/lib/store';
import { fetchIndicatorForAllCountries } from '@/lib/api';
import { getColorForValue, formatCompactNumber } from '@/lib/utils';
import { GlobeTooltip } from './GlobeTooltip';

interface GlobeProps {
  countries: CountryData[];
}

export function Globe({ countries }: GlobeProps) {
  const selectedCountry = useSelectedCountry();
  const hoveredCountry = useHoveredCountry();
  const indicator = useIndicator();
  const timeSlider = useTimeSlider();
  const setSelectedCountry = useSetSelectedCountry();
  const setHoveredCountry = useSetHoveredCountry();
  const setCamera = useSetCamera();
  const [valueMap, setValueMap] = React.useState<Map<string, number | null>>(new Map());
  const [minMax, setMinMax] = React.useState<{ min: number; max: number }>({ min: 0, max: 1 });
  const [loaded, setLoaded] = React.useState(false);
  const viewerRef = React.useRef<any>(null);
  const entitiesRef = React.useRef<Map<string, any>>(new Map());
  const animationRef = React.useRef<number>();

  React.useEffect(() => {
    let mounted = true;
    async function loadData() {
      const data = await fetchIndicatorForAllCountries(indicator!, timeSlider.year);
      if (!mounted) return;

      const values = Array.from(data.values()).filter(v => v !== null) as number[];
      const min = Math.min(...values);
      const max = Math.max(...values);

      setValueMap(data);
      setMinMax({ min, max });
      setLoaded(true);
    }
    if (indicator) loadData();
    return () => { mounted = false; };
  }, [indicator, timeSlider.year]);

  React.useEffect(() => {
    if (timeSlider.playing) {
      const interval = setInterval(() => {
        const { nextYear, timeSlider: ts } = useMundiStore.getState();
        if (ts.year < ts.range[1]) {
          nextYear();
        } else {
          useMundiStore.getState().setPlaying(false);
        }
      }, 1000 / timeSlider.speed);
      return () => clearInterval(interval);
    }
  }, [timeSlider.playing, timeSlider.speed]);

  React.useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    const handleCameraChange = () => {
      const camera = viewer.camera;
      setCamera({
        longitude: camera.positionCartographic.longitude * 180 / Math.PI,
        latitude: camera.positionCartographic.latitude * 180 / Math.PI,
        height: camera.positionCartographic.height,
        heading: camera.heading * 180 / Math.PI,
        pitch: camera.pitch * 180 / Math.PI,
        roll: camera.roll * 180 / Math.PI,
      });
    };

    viewer.camera.changed.addEventListener(handleCameraChange);
    return () => viewer.camera.changed.removeEventListener(handleCameraChange);
  }, [setCamera]);

  React.useEffect(() => {
    if (!viewerRef.current || !loaded) return;
    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    entitiesRef.current.forEach(entity => viewer.entities.remove(entity));
    entitiesRef.current.clear();

    countries.forEach(country => {
      const value = valueMap.get(country.code) ?? null;
      const color = getColorForValue(value, indicator!, minMax.min, minMax.max);
      const height = value !== null ? Math.max(10000, (value - minMax.min) / (minMax.max - minMax.min) * 500000) : 10000;

      const entity = new (Entity as any)({
        name: country.name,
        id: country.code,
        polygon: {
          hierarchy: getCountryPolygon(country.code),
          material: Color.fromCssColorString(color).withAlpha(0.8),
          height: 0,
          extrudedHeight: height,
          perPositionHeight: false,
          closeTop: true,
          closeBottom: true,
          outline: country.code === hoveredCountry || country.code === selectedCountry,
          outlineColor: country.code === selectedCountry ? Color.WHITE : Color.fromCssColorString('#ffffff44'),
          outlineWidth: country.code === selectedCountry ? 3 : 1.5,
        },
        properties: {
          countryCode: country.code,
          countryName: country.name,
          value,
          indicator,
          year: timeSlider.year,
        },
      });

      viewer.entities.add(entity);
      entitiesRef.current.set(country.code, entity);
    });
  }, [loaded, valueMap, indicator, timeSlider.year, hoveredCountry, selectedCountry, minMax, countries]);

  const handleClick = React.useCallback((movement: { position: Cartesian3 }) => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    const picked = viewer.scene.pick(movement.position);
    if (picked?.id?.properties?.countryCode) {
      const code = picked.id.properties.countryCode.getValue();
      setSelectedCountry(code === selectedCountry ? null : code);
    } else {
      setSelectedCountry(null);
    }
  }, [selectedCountry, setSelectedCountry]);

  const handleMouseMove = React.useCallback((movement: { endPosition: Cartesian3 }) => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current.cesiumElement;
    if (!viewer) return;

    const picked = viewer.scene.pick(movement.endPosition);
    if (picked?.id?.properties?.countryCode) {
      const code = picked.id.properties.countryCode.getValue();
      if (code !== hoveredCountry) setHoveredCountry(code);
    } else if (hoveredCountry) {
      setHoveredCountry(null);
    }
  }, [hoveredCountry, setHoveredCountry]);

  function getCountryPolygon(code: string): Cartesian3[] {
    const country = countries.find(c => c.code === code);
    if (!country) return [];

    const [lon, lat] = country.coordinates;
    const size = Math.sqrt(country.area) / 1e6 * 2;

    return [
      Cartesian3.fromDegrees(lon - size, lat - size),
      Cartesian3.fromDegrees(lon + size, lat - size),
      Cartesian3.fromDegrees(lon + size, lat + size),
      Cartesian3.fromDegrees(lon - size, lat + size),
      Cartesian3.fromDegrees(lon - size, lat - size),
    ];
  }

  return (
    <div className="relative w-full h-full">
      <Viewer
        ref={viewerRef}
        onLoad={({ viewer }) => {
          viewer.scene.globe.enableLighting = true;
          viewer.scene.globe.showGroundAtmosphere = true;
          viewer.scene.skyAtmosphere.show = true;
          viewer.scene.skyBox.show = false;
          viewer.scene.backgroundColor = new Color(0.04, 0.06, 0.1, 1);

          viewer.animationContainer?.style.setProperty('display', 'none', 'important');
          viewer.timelineContainer?.style.setProperty('display', 'none', 'important');
          viewer.fullscreenButton?.viewModel?.command?.();

          viewer.camera.setView({
            destination: Cartesian3.fromDegrees(-45, 10, 18000000),
            orientation: { heading: 0, pitch: -Math.PI / 2, roll: 0 },
          });

          viewer.scene.globe.depthTestAgainstTerrain = true;
        }}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        className="w-full h-full rounded-xl"
      >
        <CesiumGlobe
          baseColor={Color.fromCssColorString('#0a0f1a')}
          nightFadeInColor={Color.fromCssColorString('#081628')}
          nightFadeOutColor={Color.fromCssColorString('#0a0f1a')}
          enableLighting={true}
          showWaterEffect={true}
          waterColor={Color.fromCssColorString('#0d1b2a44')}
        />
      </Viewer>

      <GlobeTooltip
        countryCode={hoveredCountry}
        value={hoveredCountry ? valueMap.get(hoveredCountry) ?? null : null}
        indicator={indicator}
        year={timeSlider.year}
        countries={countries}
      />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-mundi-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-300 text-lg">Carregando dados para {timeSlider.year}...</p>
          </div>
        </div>
      )}
    </div>
  );
}