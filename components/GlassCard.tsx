
import React, { useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'stereo' | 'flat';
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = true,
  variant = 'stereo'
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !hoverEffect || variant !== 'stereo') return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // DIRECT DOM MANIPULATION FOR PERFORMANCE
    if (glowRef.current) {
       glowRef.current.style.opacity = '1';
       glowRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.35), transparent 40%)`;
    }
  };

  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
  };

  // Styles based on Variant
  const baseStyles = "relative transition-all duration-700";
  
  // Stereo: 3D, Glass, Shadows
  const stereoStyles = `
    rounded-[2.5rem] 
    border border-white/40 
    bg-white/10 
    backdrop-blur-[60px] 
    shadow-xl
    overflow-hidden
  `;

  // Flat: Transparent, No Shadow, Open Lines design
  const flatStyles = `
    rounded-none
    bg-transparent
    shadow-none
  `;

  const combinedStyles = `${baseStyles} ${variant === 'stereo' ? stereoStyles : flatStyles} ${
    hoverEffect ? (variant === 'stereo' ? 'hover:scale-[1.02] hover:shadow-2xl' : '') : ''
  } ${hoverEffect ? 'cursor-pointer' : ''} ${className}`;

  // Stereo specific inline styles for volume/depth
  const stereoInlineStyles = variant === 'stereo' ? {
    boxShadow: `
      0 30px 60px -12px rgba(0, 0, 0, 0.1),
      inset 2px 2px 4px rgba(255, 255, 255, 0.8),
      inset 20px 20px 50px rgba(255, 255, 255, 0.4)
    `
  } : {};

  return (
    <div
      ref={divRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={combinedStyles}
      style={stereoInlineStyles}
    >
      {/* Spotlight Glow Effect Layer (Only for Stereo) */}
      {variant === 'stereo' && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 will-change-[opacity,background]"
        />
      )}
      
      {/* FLAT MODE: Open Lines / Crop Marks Design */}
      {variant === 'flat' && (
        <>
           {/* Top Left Corner */}
           <div className="absolute top-0 left-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute top-0 left-0 w-[1px] h-4 bg-gray-400/60" />
           
           {/* Top Right Corner */}
           <div className="absolute top-0 right-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute top-0 right-0 w-[1px] h-4 bg-gray-400/60" />

           {/* Bottom Left Corner */}
           <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-gray-400/60" />

           {/* Bottom Right Corner */}
           <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-gray-400/60" />
        </>
      )}

      {/* Content */}
      <div className="relative h-full w-full z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
