import React from 'react';
import { IconProps } from '../types';

export const MacBookIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Screen */}
    <rect x="15" y="20" width="70" height="45" rx="3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Base */}
    <path d="M10 68L15 65H85L90 68C90 68 90 72 85 72H15C10 72 10 68 10 68Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    {/* Notch area suggestion */}
    <path d="M45 20V22H55V20" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

export const IPhoneIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Body */}
    <rect x="32" y="15" width="36" height="70" rx="6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Dynamic Island / Notch */}
    <path d="M45 18H55" stroke="currentColor" strokeWidth={strokeWidth + 1} strokeLinecap="round" />
    {/* Buttons */}
    <path d="M30 25V30" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M30 35V45" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M70 30V40" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const WatchIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Strap Top */}
    <path d="M40 20C40 10 42 5 50 5C58 5 60 10 60 20" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Strap Bottom */}
    <path d="M40 80C40 90 42 95 50 95C58 95 60 90 60 80" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Body */}
    <rect x="32" y="25" width="36" height="50" rx="8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Crown */}
    <path d="M69 35V45" stroke="currentColor" strokeWidth={strokeWidth + 0.5} strokeLinecap="round" />
    {/* Side Button */}
    <path d="M69 52V62" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const CodeIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Window Frame */}
    <rect x="15" y="25" width="70" height="50" rx="4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Title Bar Line */}
    <path d="M15 38H85" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeOpacity="0.5" />
    {/* Window Buttons */}
    <circle cx="22" cy="31.5" r="1.5" fill="currentColor" fillOpacity="0.8" />
    <circle cx="28" cy="31.5" r="1.5" fill="currentColor" fillOpacity="0.8" />
    <circle cx="34" cy="31.5" r="1.5" fill="currentColor" fillOpacity="0.8" />
    {/* Code Symbols */}
    <path d="M30 50 L25 55 L30 60" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M40 50 L45 55 L40 60" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    {/* Slash - Centered */}
    <path d="M33.5 62 L36.5 48" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Cursor / Line */}
    <path d="M50 55H70" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    <path d="M25 68H60" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
  </svg>
);

export const CpuIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Main Substrate */}
    <rect x="20" y="20" width="60" height="60" rx="2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Heat Spreader (IHS) */}
    <rect x="35" y="35" width="30" height="30" rx="1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Tech Lines / Traces */}
    <path d="M35 35L25 25" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
    <path d="M65 35L75 25" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
    <path d="M65 65L75 75" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
    <path d="M35 65L25 75" stroke="currentColor" strokeWidth={strokeWidth * 0.8} />
    {/* Pins indication */}
    <path d="M50 20V16" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M50 80V84" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M20 50H16" stroke="currentColor" strokeWidth={strokeWidth} />
    <path d="M80 50H84" stroke="currentColor" strokeWidth={strokeWidth} />
  </svg>
);

export const GpuIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* PCB Body */}
    <rect x="15" y="30" width="70" height="40" rx="3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Fans */}
    <circle cx="35" cy="50" r="12" stroke="currentColor" strokeWidth={strokeWidth} />
    <circle cx="65" cy="50" r="12" stroke="currentColor" strokeWidth={strokeWidth} />
    {/* Fan Blades (Simple) */}
    <path d="M35 42V58 M27 50H43" stroke="currentColor" strokeWidth={strokeWidth * 0.5} strokeOpacity="0.5" />
    <path d="M65 42V58 M57 50H73" stroke="currentColor" strokeWidth={strokeWidth * 0.5} strokeOpacity="0.5" />
    {/* PCIe Connector */}
    <path d="M25 70V76H75V70" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Shield Body */}
    <path 
      d="M50 88C50 88 20 78 20 50V25L50 15L80 25V50C80 78 50 88 50 88Z" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Checkmark inside */}
    <path 
      d="M38 50L46 58L62 42" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export const PinIcon: React.FC<IconProps> = ({ className, strokeWidth = 1 }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Pin Head */}
    <circle cx="50" cy="35" r="20" stroke="currentColor" strokeWidth={strokeWidth} />
    <circle cx="50" cy="35" r="6" stroke="currentColor" strokeWidth={strokeWidth} />
    {/* Pin Point */}
    <path d="M50 55V90" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    {/* Map Fold Lines (Background hint) */}
    <path d="M15 75L30 85L70 85L85 75" stroke="currentColor" strokeWidth={strokeWidth * 0.5} strokeDasharray="4 4" />
  </svg>
);