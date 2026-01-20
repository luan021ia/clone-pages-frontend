import React from 'react';
import './ToggleSwitch.css';

const ToggleSwitch = ({ checked, onChange, disabled = false, size = 'medium' }) => {
  const handleChange = (e) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <label className={`toggle-switch toggle-switch--${size} ${disabled ? 'toggle-switch--disabled' : ''}`}>
      <input
        type="checkbox"
        className="toggle-switch__input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className="toggle-switch__slider" />
    </label>
  );
};

export default ToggleSwitch;