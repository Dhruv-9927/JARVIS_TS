import React from 'react';

interface HoloToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const HoloToggle: React.FC<HoloToggleProps> = ({ checked, onChange }) => {
  return (
    <div className="relative">
      <div className="toggle-container" onClick={() => onChange(!checked)}>
        <div className="toggle-wrap">
          <input 
            className="toggle-input" 
            type="checkbox" 
            checked={checked} 
            readOnly 
          />
          <label className="toggle-track">
            <div className="track-lines">
              <div className="track-line"></div>
            </div>

            <div className="toggle-thumb">
              <div className="thumb-core"></div>
              <div className="thumb-inner"></div>
              <div className="thumb-scan"></div>
              <div className="energy-ring"></div>
            </div>

            <div className="toggle-data">
              <div className="data-text off">DARK</div>
              <div className="data-text on">LITE</div>
            </div>

            <div className="interface-lines">
              <div className="interface-line"></div>
              <div className="interface-line"></div>
              <div className="interface-line"></div>
            </div>

            <div className="holo-glow"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default HoloToggle;