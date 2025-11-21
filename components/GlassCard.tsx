import React, { useRef } from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  variant?: 'stereo' | 'flat';
  lite?: boolean; 
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  hoverEffect = true,
  variant = 'stereo',
  lite = false
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Optimization: Skip entirely in lite mode
    if (!divRef.current || !hoverEffect || variant !== 'stereo' || lite) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

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

  const baseStyles = "relative transition-all duration-700";
  
  // PERFORMANCE OPTIMIZATION LOGIC:
  // Normal: Uses backdrop-blur (Heavy GPU usage)
  // Lite: Uses opacity (Very light GPU usage) + No Shadow
  const stereoStyles = lite 
    ? `
      rounded-[2.5rem] 
      border border-white/80 
      bg-white/90 
      shadow-sm
      overflow-hidden
    `
    : `
      rounded-[2.5rem] 
      border border-white/40 
      bg-white/10 
      backdrop-blur-[60px] 
      shadow-xl
      overflow-hidden
    `;

  const flatStyles = `
    rounded-none
    bg-transparent
    shadow-none
  `;

  const combinedStyles = `${baseStyles} ${variant === 'stereo' ? stereoStyles : flatStyles} ${
    hoverEffect && !lite ? (variant === 'stereo' ? 'hover:scale-[1.02] hover:shadow-2xl' : '') : ''
  } ${hoverEffect ? 'cursor-pointer' : ''} ${className}`;

  // Only apply complex shadows in standard mode
  const stereoInlineStyles = (variant === 'stereo' && !lite) ? {
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
      {/* Glow only in Standard Mode */}
      {variant === 'stereo' && !lite && (
        <div
          ref={glowRef}
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 will-change-[opacity,background]"
        />
      )}
      
      {variant === 'flat' && (
        <>
           <div className="absolute top-0 left-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute top-0 left-0 w-[1px] h-4 bg-gray-400/60" />
           <div className="absolute top-0 right-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute top-0 right-0 w-[1px] h-4 bg-gray-400/60" />
           <div className="absolute bottom-0 left-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute bottom-0 left-0 w-[1px] h-4 bg-gray-400/60" />
           <div className="absolute bottom-0 right-0 w-4 h-[1px] bg-gray-400/60" />
           <div className="absolute bottom-0 right-0 w-[1px] h-4 bg-gray-400/60" />
        </>
      )}

      <div className="relative h-full w-full z-10">
        {children}
      </div>
    </div>
  );
};

export default GlassCard;