"use client";

import React from "react";

export interface ModelStatusEntry {
  name: string;
  mentioned: boolean;
}

export interface RadialSignalDialProps {
  score: number; // 0 - 100
  modelStatus: ModelStatusEntry[]; // Exactly 4 entries expected
  size?: number; // default 220
  illustrative?: boolean; // default false
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  // Clamp angle to prevent 0-length or 360-degree loop issues
  const actualEndAngle = Math.max(startAngle + 0.1, endAngle);
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, actualEndAngle);
  const angleSpan = actualEndAngle - startAngle;
  const largeArcFlag = angleSpan > 180 ? 1 : 0;

  return [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");
}

export const RadialSignalDial: React.FC<RadialSignalDialProps> = ({
  score,
  modelStatus,
  size = 220,
  illustrative = false,
}) => {
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Arc geometry constants (standard 200x200 viewBox)
  const cx = 100;
  const cy = 100;
  const r = 70;
  const strokeWidth = 10;
  const tickRadius = 85;

  const startAngle = 135; // Bottom-left
  const totalDegrees = 270;
  const endAngle = startAngle + totalDegrees; // 405deg (Bottom-right)

  // Calculate filled score arc end angle
  const scoreAngleSpan = (clampedScore / 100) * totalDegrees;
  const scoreEndAngle = startAngle + scoreAngleSpan;

  // Background track path & Filled score arc path
  const bgPath = describeArc(cx, cy, r, startAngle, endAngle);
  const scorePath =
    clampedScore > 0 ? describeArc(cx, cy, r, startAngle, scoreEndAngle) : null;

  // Ticks for 4 models (spaced along 270deg arc: 135deg, 225deg, 315deg, 405deg)
  const tickAngles = [135, 225, 315, 405];

  const models = modelStatus.slice(0, 4);

  return (
    <div
      className="inline-flex flex-col items-center select-none"
      style={{ width: size }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
        >
          <defs>
            {/* Glow Filter for Active Signals */}
            <filter id="amber-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#F7B73E" />
            </linearGradient>
          </defs>

          {/* Background Track Arc */}
          <path
            d={bgPath}
            fill="none"
            stroke="#1B2333"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Score Arc */}
          {scorePath && (
            <path
              d={scorePath}
              fill="none"
              stroke="url(#score-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          )}

          {/* 4 Outer Model Signal Ticks */}
          {tickAngles.map((angle, idx) => {
            const pos = polarToCartesian(cx, cy, tickRadius, angle);
            const model = models[idx];
            const isMentioned = model ? model.mentioned : false;

            return (
              <g key={idx}>
                {/* Outer halo for active ticks */}
                {isMentioned && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="6.5"
                    fill="#F5A623"
                    opacity="0.25"
                    filter="url(#amber-glow)"
                  />
                )}
                {/* Core tick indicator dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4.5"
                  fill={isMentioned ? "#F5A623" : "#6B7280"}
                  opacity={isMentioned ? 1 : 0.4}
                  filter={isMentioned ? "url(#amber-glow)" : undefined}
                  className="transition-colors duration-300"
                />
              </g>
            );
          })}
        </svg>

        {/* Center Score & Label Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
          {illustrative && (
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/20 px-2 py-0.5 rounded-full mb-1">
              Sample Score
            </span>
          )}
          <div className="flex items-baseline justify-center">
            <span className="font-display text-4xl sm:text-5xl font-bold text-[#EDEEF2] tracking-tight drop-shadow-md">
              {clampedScore}
            </span>
            <span className="text-xl sm:text-2xl font-bold text-[#F5A623] ml-0.5">
              %
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#6B7280] uppercase tracking-wider mt-0.5">
            AI Visibility
          </span>
        </div>
      </div>

      {/* Below Dial Legend: 4 Model Names */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2 w-full max-w-[240px]">
        {models.map((m, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 text-[11px] font-mono truncate"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                m.mentioned
                  ? "bg-[#F5A623] shadow-[0_0_6px_#F5A623]"
                  : "bg-[#6B7280]/40"
              }`}
            />
            <span
              className={`truncate ${
                m.mentioned ? "text-[#EDEEF2] font-semibold" : "text-[#6B7280]"
              }`}
            >
              {m.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
