'use client';

import * as React from 'react';

interface SparklineProps {
  data: { year: number; value: number | null }[];
  color: string;
  height?: number;
  width?: string | number;
  className?: string;
  showPoints?: boolean;
}

export function Sparkline({ 
  data, 
  color, 
  height = 50, 
  width = '100%',
  className = '',
  showPoints = false
}: SparklineProps) {
  const validData = data.filter(d => d.value !== null);
  if (validData.length < 2) return null;

  const values = validData.map(d => d.value!);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = validData.map((d, i) => {
    const x = (i / (validData.length - 1)) * 100;
    const y = 100 - ((d.value! - min) / range) * 100;
    return `${x}% ${y}%`;
  }).join(',');

  const currentYear = validData[validData.length - 1]?.year;
  const currentValue = validData[validData.length - 1]?.value;

  return (
    <div className={className} style={{ width, height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full" role="img" aria-label={`Gráfico de ${validData.length} pontos de ${validData[0].year} a ${currentYear}`}>
        <defs>
          <linearGradient id="sparkline-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="sparkline-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Area */}
        <path
          d={`M${points[0]} L${points} L100% 100% L0% 100% Z`}
          fill="url(#sparkline-gradient)"
        />
        
        {/* Line */}
        <path
          d={`M${points}`}
          stroke="url(#sparkline-stroke)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Current point */}
        {showPoints && currentValue !== null && (
          <circle
            cx={100}
            cy={100 - ((currentValue - min) / range) * 100}
            r="3"
            fill={color}
            stroke="white"
            strokeWidth="1.5"
          />
        )}
      </svg>
    </div>
  );
}