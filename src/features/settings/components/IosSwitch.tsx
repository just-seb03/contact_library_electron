import React, { type CSSProperties } from 'react';

export interface IosSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  darkMode?: boolean;
  ariaLabel?: string;
}

export const IosSwitch: React.FC<IosSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  activeColor = '#34C759',
  inactiveColor,
  darkMode = false,
  ariaLabel = 'Interruptor',
}) => {
  const defaultInactive = darkMode ? '#39393D' : '#E9E9EA';
  const currentBgColor = checked ? activeColor : (inactiveColor ?? defaultInactive);

  const trackStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: 46,
    minWidth: 46,
    maxWidth: 46,
    height: 28,
    minHeight: 28,
    borderRadius: 14,
    backgroundColor: currentBgColor,
    border: 'none',
    padding: 0,
    margin: 0,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    flexShrink: 0,
    transition: 'background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  const thumbStyle: CSSProperties = {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 1px rgba(0, 0, 0, 0.15)',
    transform: checked ? 'translateX(18px)' : 'translateX(0px)',
    transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
      style={trackStyle}
    >
      <span style={thumbStyle} />
    </button>
  );
};
