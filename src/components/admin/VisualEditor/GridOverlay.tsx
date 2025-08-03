import React from 'react';

interface GridOverlayProps {
  gridSize: number;
}

const GridOverlay: React.FC<GridOverlayProps> = ({ gridSize = 20 }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`
      }}
    />
  );
};

export default GridOverlay;
