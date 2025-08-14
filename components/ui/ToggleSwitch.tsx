import React from 'react';

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle, label }) => {
  return (
    <label htmlFor="toggle" className="flex items-center cursor-pointer">
      <span className="mr-3 text-text-secondary dark:text-dark-text-secondary">{label}</span>
      <div className="relative">
        <input id="toggle" type="checkbox" className="sr-only" checked={isOn} onChange={handleToggle} />
        <div className={`block w-14 h-8 rounded-full transition-colors ${isOn ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isOn ? 'transform translate-x-6' : ''}`}></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;
