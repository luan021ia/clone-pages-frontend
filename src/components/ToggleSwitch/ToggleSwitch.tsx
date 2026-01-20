import React from 'react';
import './ToggleSwitch.css';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  ariaLabel?: string;
  id?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  ariaLabel,
  id
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    onChange(e.target.checked);
  };

  return (
    <label
      className={`toggle-switch toggle-switch--${size} ${
        disabled ? 'toggle-switch--disabled' : ''
      }`}
      htmlFor={id}
    >
      <input
        id={id}
        type="checkbox"
        className="toggle-switch__input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        aria-label={ariaLabel}
      />
      <span className="toggle-switch__slider" aria-hidden="true" />
    </label>
  );
};

export default ToggleSwitch;
