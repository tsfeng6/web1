import React, { useMemo } from 'react';

interface BackgroundProps {
  visible: boolean;
  refreshKey: number;
}

const Background: React.FC<BackgroundProps> = ({ visible, refreshKey }) => {
  // Monet Palette: Soft, pastel, impressionist colors
  const MONET_PALETTE = [
    '#B5C7D3', // Foggy Blue
    '#D8BFD8', // Thistle
    '#F2D7D5', // Pale Pink
    '#D4E6F1', // Sky Blue
    '#D5F5E3', // Mint
    '#FCF3CF', // Cream
    '#E8DAEF', // Soft Lavender
    '#A9DFBF', // Green
    '#FAD7A0', // Peach
    '#AED6F1', // Blue
  ];

  // Re-generate blobs when refreshKey changes
  const blobs = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      color: MONET_PALETTE[Math.floor(Math.random() * MONET_PALETTE.length)],
      // Fully randomized positions
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 40 + 20, // 20vw - 60vw
      
      // Animation physics
      moveDuration: Math.random() * 20 + 20,
      delay: Math.random() * -20,
    }));
  }, [refreshKey]);

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Background base - Transparent to let any parent bg show, or white fallback */}
      <div className="absolute inset-0 bg-white/30" />
      
      {blobs.map((blob) => (
        <div
          key={`${blob.id}-${refreshKey}`} // Crucial: forces React to destroy and recreate DOM node for new random positions
          className="absolute rounded-full mix-blend-multiply filter blur-[80px] opacity-60"
          style={{
            backgroundColor: blob.color,
            width: `${blob.size}vw`,
            height: `${blob.size}vw`,
            top: `${blob.top}%`,
            left: `${blob.left}%`,
            transform: 'translate(-50%, -50%)', // Center the blob on the coordinate
            animation: `float ${blob.moveDuration}s infinite ease-in-out alternate`,
            animationDelay: `${blob.delay}s`,
          }}
        />
      ))}
      
      {/* Noise texture overlay for realism */}
      <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}
      ></div>

      <style>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
          33% { transform: translate(-40%, -60%) scale(1.1) rotate(10deg); }
          66% { transform: translate(-60%, -40%) scale(0.9) rotate(-10deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
};

export default Background;