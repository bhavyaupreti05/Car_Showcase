import React from 'react';

/**
 * 5-Axis Spider / Radar Telemetry Chart for Automotive DNA
 */
export const RadarChart = ({
  userDna = { speed: 80, safety: 85, luxury: 70, practicality: 75, economy: 65 },
  carDna = { speed: 85, safety: 88, luxury: 75, practicality: 70, economy: 60 },
  carName = 'Matched Vehicle',
  size = 320,
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.35;

  const axes = [
    { key: 'speed', label: 'Speed & Thrill', icon: '⚡', angle: -Math.PI / 2 },
    { key: 'safety', label: 'Safety & NCAP', icon: '🛡️', angle: -Math.PI / 2 + (2 * Math.PI) / 5 },
    { key: 'luxury', label: 'Luxury & Tech', icon: '👑', angle: -Math.PI / 2 + (4 * Math.PI) / 5 },
    { key: 'practicality', label: 'Practicality', icon: '📦', angle: -Math.PI / 2 + (6 * Math.PI) / 5 },
    { key: 'economy', label: 'Efficiency', icon: '🌿', angle: -Math.PI / 2 + (8 * Math.PI) / 5 },
  ];

  // Helper to convert polar to cartesian
  const getPoint = (angle, value) => {
    const r = (Math.max(15, Math.min(100, value)) / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  };

  // Helper to build polygon points string
  const getPolygonPoints = (dna) =>
    axes
      .map(({ key, angle }) => {
        const pt = getPoint(angle, dna[key] || 50);
        return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
      })
      .join(' ');

  // Grid levels (25%, 50%, 75%, 100%)
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="overflow-visible filter drop-shadow-md"
        >
          {/* Circular/Pentagon grid levels */}
          {gridLevels.map((lvl, idx) => {
            const points = axes
              .map(({ angle }) => {
                const x = cx + radius * lvl * Math.cos(angle);
                const y = cy + radius * lvl * Math.sin(angle);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <polygon
                key={idx}
                points={points}
                fill="none"
                stroke="currentColor"
                className="text-gray-200 stroke-1"
                strokeDasharray={idx < 3 ? '3 3' : 'none'}
              />
            );
          })}

          {/* Radial axis lines */}
          {axes.map(({ angle }, idx) => {
            const x2 = cx + radius * Math.cos(angle);
            const y2 = cy + radius * Math.sin(angle);
            return (
              <line
                key={idx}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className="text-gray-200 stroke-1"
              />
            );
          })}

          {/* User Target DNA Polygon (Blue gradient fill) */}
          <polygon
            points={getPolygonPoints(userDna)}
            fill="rgba(59, 130, 246, 0.22)"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Car DNA Polygon (Purple gradient fill) */}
          <polygon
            points={getPolygonPoints(carDna)}
            fill="rgba(168, 85, 247, 0.28)"
            stroke="#9333ea"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Data point dots for car */}
          {axes.map(({ key, angle }, idx) => {
            const pt = getPoint(angle, carDna[key] || 50);
            return (
              <circle
                key={idx}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#9333ea"
                stroke="#ffffff"
                strokeWidth="2"
                className="transition-all duration-700"
              />
            );
          })}

          {/* Axis Labels & Values */}
          {axes.map(({ key, label, icon, angle }, idx) => {
            const labelRadius = radius + 32;
            const lx = cx + labelRadius * Math.cos(angle);
            const ly = cy + labelRadius * Math.sin(angle);

            // Alignment adjustments
            const isTop = Math.abs(angle + Math.PI / 2) < 0.2;
            const isBottom = Math.abs(angle - Math.PI / 2) < 0.2;
            const isRight = Math.cos(angle) > 0.3;

            const textAnchor = isTop || isBottom ? 'middle' : isRight ? 'start' : 'end';

            return (
              <g key={idx} transform={`translate(${lx}, ${ly})`}>
                <text
                  textAnchor={textAnchor}
                  className="fill-gray-700 text-[11px] font-bold tracking-tight"
                  dominantBaseline="central"
                >
                  <tspan className="text-sm">{icon}</tspan> {label}
                </text>
                <text
                  textAnchor={textAnchor}
                  y="14"
                  className="fill-purple-600 text-[10px] font-extrabold"
                  dominantBaseline="central"
                >
                  {carDna[key]}%
                  <tspan className="fill-blue-500 font-medium"> ({userDna[key]}% req)</tspan>
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-blue-700">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-blue-300" />
          <span>Your Target DNA</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50/80 px-3 py-1 text-purple-700">
          <div className="h-2.5 w-2.5 rounded-full bg-purple-600 ring-2 ring-purple-300" />
          <span>{carName} Profile</span>
        </div>
      </div>
    </div>
  );
};

export default RadarChart;
