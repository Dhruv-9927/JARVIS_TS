import React from 'react';

interface GlitchButtonProps {
  text: string;
  onClick?: () => void;
  isLightMode: boolean;
  isActive?: boolean;
  variant?: 'default' | 'danger';
  size?: 'sm' | 'lg';
}

const GlitchButton: React.FC<GlitchButtonProps> = ({ 
  text, 
  onClick, 
  isLightMode, 
  isActive = false, 
  variant = 'default',
  size = 'lg'
}) => {
  // Determine CSS Variables based on props
  const hue = variant === 'danger' ? 340 : (isLightMode ? 200 : 217);
  const sat = variant === 'danger' ? '70%' : (isLightMode ? '10%' : '33%');
  
  // Lightness values
  const frontL = variant === 'danger' ? '40%' : (isLightMode ? '96%' : '17%');
  const edgeL1 = variant === 'danger' ? '30%' : (isLightMode ? '90%' : '16%');
  const edgeL2 = variant === 'danger' ? '50%' : (isLightMode ? '80%' : '32%');
  
  const textColor = variant === 'danger' ? 'white' : (isLightMode ? '#1e293b' : 'white');
  const activeColor = isLightMode ? '#0891b2' : '#22d3ee';
  
  // Font Size
  const fontSize = size === 'sm' ? '0.8rem' : '1.25rem';
  const padding = size === 'sm' ? '8px 16px' : '12px 28px';

  return (
    <button 
      className={`pushable-button ${isActive ? 'active-state' : ''}`} 
      onClick={onClick}
      style={{
        '--hue': hue,
        '--sat': sat,
        '--front-l': frontL,
        '--edge-l1': edgeL1,
        '--edge-l2': edgeL2,
        '--text-color': textColor,
        '--active-color': activeColor,
        fontSize: fontSize,
      } as React.CSSProperties}
    >
      <span className="shadow"></span>
      <span className="edge"></span>
      <span className="front" style={{ padding }}>
        {text}
      </span>
    </button>
  );
};

export default GlitchButton;