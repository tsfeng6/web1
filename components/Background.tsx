import React, { useMemo } from 'react';

interface BackgroundProps {
  visible: boolean;
  refreshKey: number;
  lite?: boolean;
}

const Background: React.FC<BackgroundProps> = ({ visible, refreshKey, lite = false }) => {
  // Monet Palette
  const MONET_PALETTE = [
    '#B5C7D3', '#D8BFD8', '#F2D7D5', '#D4E6F1', '#D5F5E3', 
    '#FCF3CF', '#E8DAEF', '#A9DFBF', '#FAD7A0', '#AED6F1',
  ];

  // OPTIMIZATION:
  // HD 520 struggles with fill-rate.
  // 3 blobs is the sweet spot between "empty" and "laggy".
  const BLOB_COUNT = 3;

  const blobs = useMemo(() => {
    return Array.from({ length: BLOB_COUNT }).map((_, i) => ({
      id: i,
      color: MONET_PALETTE[Math.floor(Math.random() * MONET_PALETTE.length)],
      top: Math.random() * 80,
      left: Math.random() * 80,
      size: Math.random() * 30 + 40, // 40vw - 70vw (Large but few)
      moveDuration: Math.random() * 20 + 25, // Slower animation is smoother on low FPS
      delay: Math.random() * -20,
    }));
  }, [refreshKey]);

  // Lite Mode: Static gradient (Lowest cost)
  if (lite) {
      return (
          <div 
            className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
            style={{
                background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
            }}
          />
      );
  }

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="absolute inset-0 bg-white/40" />
      
      {blobs.map((blob) => (
        <div
          key={`${blob.id}-${refreshKey}`}
          // OPTIMIZATION CRITICAL POINTS:
          // 1. transform-gpu: Forces creation of a composite layer.
          // 2. will-change-transform: Hints browser to optimize for movement.
          // 3. REMOVED 'mix-blend-mode': This is the most expensive operation for iGPUs.
          className="absolute rounded-full opacity-40 transform-gpu will-change-transform blur-[80px]"
          style={{
            backgroundColor: blob.color,
            width: `${blob.size}vw`,
            height: `${blob.size}vw`,
            top: `${blob.top}%`,
            left: `${blob.left}%`,
            // translateZ(0) engages hardware acceleration
            transform: 'translate3d(-50%, -50%, 0)', 
            animation: `float ${blob.moveDuration}s infinite ease-in-out alternate`,
            animationDelay: `${blob.delay}s`,
          }}
        />
      ))}
      
      <style>{`
        @keyframes float {
          0% { transform: translate3d(-50%, -50%, 0) scale(1) rotate(0deg); }
          33% { transform: translate3d(-40%, -60%, 0) scale(1.05) rotate(5deg); }
          66% { transform: translate3d(-60%, -40%, 0) scale(0.95) rotate(-5deg); }
          100% { transform: translate3d(-50%, -50%, 0) scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Background;