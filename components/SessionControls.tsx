import React from 'react';

interface SessionControlsProps {
  onStop: () => void;
  onReset: () => void;
}

const SessionControls: React.FC<SessionControlsProps> = ({ onStop, onReset }) => {
  return (
    <div className="radio-input">
      <button className="label" onClick={onStop}>
        <span className="text">STOP</span>
      </button>
      <button className="label" onClick={onReset}>
        <span className="text">RESET</span>
      </button>
    </div>
  );
};

export default SessionControls;