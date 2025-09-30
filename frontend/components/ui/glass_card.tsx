"use client";

import React, { ReactNode } from "react";

interface LiquidGlassCardProps {
  children: ReactNode;
}

const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({ children }) => {
  return (
    <div className="relative">
      {/* SVG Filter (keep once per page / layout) */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="glass-distortion" x="0%" y="0%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.003 0.003"
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale="200"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Card */}
      <div className="relative w-[400px] h-[300px] rounded-[28px] isolate shadow-[0px_6px_21px_-4px_rgba(90,90,90,0.2)] cursor-pointer">
        {/* Tint + inner shadow */}
        <div className="absolute inset-0 rounded-[28px] shadow-[inset_0_0_50px_6px_rgba(225,225,225,0.3)] bg-[rgba(61,61,61,0.2)] pointer-events-none"></div>

        {/* Blur + distortion */}
        <div
          className="absolute inset-0 rounded-[28px] backdrop-blur-sm pointer-events-none -z-10"
          style={{ filter: "url(#glass-distortion)" }}
        ></div>

        {/* Dynamic Content */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center p-8 text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LiquidGlassCard;