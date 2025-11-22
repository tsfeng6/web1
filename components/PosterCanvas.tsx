import React, { forwardRef } from 'react';
import { BlobConfig } from '../types';
import { MacBookIcon, IPhoneIcon, WatchIcon, CodeIcon, CpuIcon, GpuIcon } from './SketchIcons';

interface PosterCanvasProps {
  blobs: BlobConfig[];
  qrCodeImage: string | null;
  version: 'v1' | 'v2';
}

// Use forwardRef so the parent can access the DOM node for html-to-image
const PosterCanvas = forwardRef<HTMLDivElement, PosterCanvasProps>(({ blobs, qrCodeImage, version }, ref) => {
  
  // Scale Factor Configuration
  // Reverted to original size as requested
  const BASE_WIDTH = 1024;
  const BASE_HEIGHT = 768;
  const SCALE_FACTOR = 1.0;

  // Apple-style font stack
  const fontStyle = {
    fontFamily: '"PingFang SC", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif',
  };

  // Reduced stroke width for better clarity
  const iconStrokeWidth = 3;
  
  // Unified Color for Text and Icons (The "Grey" requested)
  const unifiedGrayColor = 'rgba(60, 65, 70, 0.8)';

  // Unified Drop Shadow Filter for that "Etched/Floating" look
  const unifiedGlassFilter = `
    drop-shadow(1px 1px 0px rgba(255, 255, 255, 0.8)) 
    drop-shadow(0px 6px 10px rgba(0, 0, 0, 0.12))
  `;

  // 1. Panel Style: 3D Liquid Glass
  const liquidGlassStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 100%)',
    backdropFilter: 'blur(60px) saturate(120%)',
    WebkitBackdropFilter: 'blur(60px) saturate(120%)',
    borderRadius: '2.5rem',
    // Directional lighting on borders
    borderTop: '1.5px solid rgba(255, 255, 255, 0.9)',
    borderLeft: '1.5px solid rgba(255, 255, 255, 0.9)',
    borderBottom: '1.5px solid rgba(255, 255, 255, 0.2)',
    borderRight: '1.5px solid rgba(255, 255, 255, 0.2)',
    // Volume shadows
    boxShadow: `
      0 30px 60px -12px rgba(0, 0, 0, 0.15),
      inset 2px 2px 4px rgba(255, 255, 255, 1),
      inset 20px 20px 50px rgba(255, 255, 255, 0.5),
      inset -10px -10px 40px rgba(0, 0, 0, 0.05)
    `
  };

  // 2. Font Style: Liquid Glass Typography BASE
  const glassTextStyle: React.CSSProperties = {
    ...fontStyle,
    color: unifiedGrayColor, 
    filter: unifiedGlassFilter,
    fontWeight: 800,
  };

  // 3. Icon Style: Liquid Glass Tubing
  const glassIconStyle: React.CSSProperties = {
    color: unifiedGrayColor, 
    filter: unifiedGlassFilter,
  };

  // Configuration for Version 2 List
  const v2ListItems = [
    { Icon: MacBookIcon, label: '电脑讨论' },
    { Icon: IPhoneIcon, label: '手机讨论' },
    { Icon: WatchIcon, label: '二手数码交易' },
    { Icon: CodeIcon, label: '软件算法讨论' },
    { Icon: CpuIcon, label: '硬件交流' },
    { Icon: GpuIcon, label: '科技新闻交流' },
  ];

  return (
    <div 
      ref={ref}
      className="relative overflow-hidden bg-gray-50 shadow-2xl flex-shrink-0"
      style={{
        width: `${BASE_WIDTH * SCALE_FACTOR}px`,
        height: `${BASE_HEIGHT * SCALE_FACTOR}px`,
      }}
    >
      {/* Inner Wrapper */}
      <div 
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${SCALE_FACTOR})`,
          transformOrigin: 'top left',
        }}
        className="relative flex items-center justify-center w-full h-full"
      >
        {/* 1. Background Layer - Soft Monet Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-white">
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="absolute rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-pulse"
              style={{
                backgroundColor: blob.color,
                top: blob.top,
                left: blob.left,
                width: blob.width,
                height: blob.height,
                animationDuration: blob.animationDuration,
              }}
            />
          ))}
          <div className="absolute inset-0 opacity-[0.03] bg-noise mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[60px]" />
        </div>

        {/* 2. Main Content Grid - This is the "Effective Part" for cropping */}
        <div 
          id="poster-content-area"
          className="relative z-10 w-[900px] h-[660px] grid grid-cols-10 gap-8"
        >
          
          {/* LEFT COLUMN: Title & QR (Common to both versions) */}
          <div className="col-span-6 flex flex-col gap-8 h-full">
            {/* Title Block */}
            <div 
              style={liquidGlassStyle}
              className="flex-grow p-10 flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rotate-12"></div>
              <div className="relative z-10 transform translate-y-[-10px]">
                <h1 
                  style={{
                    ...glassTextStyle,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.06em', 
                  }}
                  className="text-[7rem] leading-[0.85] select-none"
                >
                  DigiBox
                </h1>
                <h2 
                  style={{ 
                    ...glassTextStyle, 
                    fontWeight: 700, 
                    fontSize: '3.5rem',
                    marginTop: '1.5rem',
                    lineHeight: 1.2,
                    letterSpacing: '0.05em' 
                  }}
                >
                  <div>数码交流</div>
                </h2>
              </div>
              <div className="mt-12 w-24 h-[8px] rounded-full"
                   style={{ 
                     background: 'rgba(0,0,0,0.2)',
                     boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.5)'
                   }}
              ></div>
            </div>

            {/* QR Code Block */}
            <div 
              style={liquidGlassStyle}
              className="h-[260px] flex items-center justify-between p-10 relative overflow-hidden"
            >
               <div className="relative z-10 bg-white/40 p-5 rounded-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_8px_16px_rgba(0,0,0,0.1)] border border-white/60 backdrop-blur-md">
                  {qrCodeImage ? (
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className="w-36 h-36 object-contain" 
                      style={{ filter: unifiedGlassFilter }} 
                    />
                  ) : (
                    <div className="w-36 h-36 flex items-center justify-center border-4 border-dashed border-gray-400/50 rounded-2xl text-gray-500/80 font-bold text-lg tracking-widest" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.8)'}}>
                      QR
                    </div>
                  )}
               </div>
               <div className="flex-1 flex flex-col items-end justify-center space-y-3 pr-4">
                  <div className="w-16 h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.1)', boxShadow: '0 1px 0 rgba(255,255,255,0.5)'}}></div>
                  <div className="w-28 h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.1)', boxShadow: '0 1px 0 rgba(255,255,255,0.5)'}}></div>
                  <div className="w-20 h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.1)', boxShadow: '0 1px 0 rgba(255,255,255,0.5)'}}></div>
                  <p style={{...glassTextStyle, fontSize: '1.1rem', fontWeight: 600}} className="mt-6 tracking-widest uppercase opacity-80">
                    Scan to Join
                  </p>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Dynamic based on Version */}
          <div 
            style={liquidGlassStyle}
            className={`col-span-4 p-8 h-full flex flex-col relative overflow-hidden ${version === 'v1' ? 'justify-between' : 'justify-center'}`}
          >
            {version === 'v1' ? (
              /* VERSION 1: GRID LAYOUT */
              <div className="flex-1 grid grid-cols-2 gap-0 items-center justify-items-center content-around py-4" style={glassIconStyle}>
                 <div className="transform hover:scale-110 transition-transform duration-500">
                   <CodeIcon className="w-32 h-32" strokeWidth={iconStrokeWidth} />
                 </div>
                 <div className="transform hover:scale-110 transition-transform duration-500">
                   <MacBookIcon className="w-32 h-32" strokeWidth={iconStrokeWidth} />
                 </div>
                 <div className="transform hover:scale-110 transition-transform duration-500">
                   <CpuIcon className="w-28 h-28" strokeWidth={iconStrokeWidth} />
                 </div>
                 <div className="transform hover:scale-110 transition-transform duration-500">
                   <IPhoneIcon className="w-28 h-28" strokeWidth={iconStrokeWidth} />
                 </div>
                 <div className="transform hover:scale-110 transition-transform duration-500">
                   <GpuIcon className="w-28 h-28" strokeWidth={iconStrokeWidth} />
                 </div>
                 <div className="transform hover:scale-110 transition-transform duration-500">
                   <WatchIcon className="w-28 h-28" strokeWidth={iconStrokeWidth} />
                 </div>
              </div>
            ) : (
              /* VERSION 2: LIST LAYOUT */
              <div className="flex-1 flex flex-col justify-between py-2 pl-4 pr-2" style={glassIconStyle}>
                {v2ListItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 group">
                    <div className="flex-shrink-0 w-20 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                       <item.Icon className="w-16 h-16" strokeWidth={iconStrokeWidth} />
                    </div>
                    <div 
                      style={{
                        ...glassTextStyle,
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        textAlign: 'left'
                      }}
                    >
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
});

PosterCanvas.displayName = 'PosterCanvas';
export default PosterCanvas;