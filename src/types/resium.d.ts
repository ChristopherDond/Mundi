declare module 'resium' {
  import * as React from 'react';
  import { Viewer, Entity, Globe, Color, Cartesian3 } from 'cesium';

  export interface ViewerProps {
    ref?: React.RefObject<{ cesiumElement: any }>;
    onLoad?: (options: { viewer: any }) => void;
    onClick?: (movement: { position: Cartesian3 }) => void;
    onMouseMove?: (movement: { endPosition: Cartesian3 }) => void;
    className?: string;
    children?: React.ReactNode;
  }

  export const Viewer: React.FC<ViewerProps>;

  export interface EntityProps {
    name?: string;
    id?: string;
    polygon?: any;
    properties?: any;
  }

  export const Entity: React.FC<EntityProps>;

  export interface GlobeProps {
    baseColor?: any;
    nightFadeInColor?: any;
    nightFadeOutColor?: any;
    enableLighting?: boolean;
    showWaterEffect?: boolean;
    waterColor?: any;
  }

  export const Globe: React.FC<GlobeProps>;

  export { Color, Cartesian3 } from 'cesium';
}
