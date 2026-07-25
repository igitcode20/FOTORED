import React from 'react';

export default function Logo({ size = 'medium', variant = 'light' }) {
  const sizeClasses = {
    small: 'h-8 text-xl',
    medium: 'h-11 text-2xl',
    large: 'h-16 text-4xl',
    huge: 'h-24 text-6xl'
  }[size] || 'h-11 text-2xl';

  const iconSizes = {
    small: 'w-8 h-8',
    medium: 'w-11 h-11',
    large: 'w-16 h-16',
    huge: 'w-24 h-24'
  }[size] || 'w-11 h-11';

  return (
    <div className={`flex items-center gap-3 font-heading font-black tracking-tight select-none ${sizeClasses}`}>
      <div className={`relative ${iconSizes} flex-shrink-0`}>
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-sm">
          {/* Outer Orbit Nodes & Red Arc */}
          <path d="M 270 90 A 160 160 0 0 1 405 275" fill="none" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" />
          <circle cx="270" cy="90" r="16" fill="#DC2626" />
          <circle cx="395" cy="165" r="14" fill="#DC2626" />
          <circle cx="410" cy="225" r="14" fill="#DC2626" />
          <circle cx="405" cy="285" r="18" fill="#DC2626" />
          <circle cx="340" cy="335" r="18" fill="#DC2626" />

          {/* Navy Arc */}
          <path d="M 230 405 A 160 160 0 0 1 150 280" fill="none" stroke="#0F172A" strokeWidth="16" strokeLinecap="round" />
          <circle cx="235" cy="405" r="16" fill="#0F172A" />
          <circle cx="145" cy="280" r="18" fill="#0F172A" />

          {/* Camera Ring & Iris Blades */}
          <circle cx="250" cy="250" r="125" fill="none" stroke="#0F172A" strokeWidth="18" />
          <path d="M 265 125 A 125 125 0 0 1 265 375" fill="none" stroke="#DC2626" strokeWidth="18" strokeLinecap="round" />

          {/* Aperture Blades */}
          <g fill="#0F172A" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round">
            <path d="M 250 145 L 310 190 L 235 210 Z" />
            <path d="M 310 190 L 335 270 L 270 240 Z" />
            <path d="M 335 270 L 290 335 L 255 270 Z" />
            <path d="M 290 335 L 210 320 L 235 255 Z" />
            <path d="M 210 320 L 175 250 L 230 240 Z" />
            <path d="M 175 250 L 225 170 L 250 220 Z" />
          </g>
        </svg>
      </div>
      <div className="leading-none">
        <span className="text-slate-900">FOTO</span>
        <span className="text-red-600">RED</span>
      </div>
    </div>
  );
}
