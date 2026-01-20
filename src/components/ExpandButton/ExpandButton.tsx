import React, { useState, useCallback, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import './ExpandButton.css';

export interface ExpandButtonProps {
  onExpand?: () => void;
  onCollapse?: () => void;
  onToggle?: (isExpanded: boolean) => void;
  initialExpanded?: boolean;
  className?: string;
  style?: React.CSSProperties;
  size?: 'small' | 'medium' | 'large';
  theme?: 'dark' | 'light' | 'colored';
  showTooltip?: boolean;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  ariaLabel?: string;
  disabled?: boolean;
  loading?: boolean;
}

interface ExpandButtonState {
  isExpanded: boolean;
  isHovered: boolean;
  isFocused: boolean;
}

const ExpandButton: React.FC<ExpandButtonProps> = ({
  onExpand,
  onCollapse,
  onToggle,
  initialExpanded = false,
  className = '',
  style,
  size = 'medium',
  theme = 'dark',
  showTooltip = true,
  tooltipPosition = 'top',
  ariaLabel,
  disabled = false,
  loading = false,
}) => {
  const [state, setState] = useState<ExpandButtonState>({
    isExpanded: initialExpanded,
    isHovered: false,
    isFocused: false,
  });

  // Handlers de Eventos
  const handleToggle = useCallback(() => {
    if (disabled || loading) return;

    const newExpandedState = !state.isExpanded;
    
    setState(prev => ({ ...prev, isExpanded: newExpandedState }));
    
    // Callbacks
    if (newExpandedState && onExpand) {
      onExpand();
    } else if (!newExpandedState && onCollapse) {
      onCollapse();
    }
    
    if (onToggle) {
      onToggle(newExpandedState);
    }
  }, [state.isExpanded, disabled, loading, onExpand, onCollapse, onToggle]);

  const handleMouseEnter = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState(prev => ({ ...prev, isHovered: false }));
  }, []);

  const handleFocus = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: true }));
  }, []);

  const handleBlur = useCallback(() => {
    setState(prev => ({ ...prev, isFocused: false }));
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  // Efeitos
  useEffect(() => {
    // Salvar preferência no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('clonepages-expand-state', JSON.stringify(state.isExpanded));
    }
  }, [state.isExpanded]);

  useEffect(() => {
    // Restaurar estado do localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('clonepages-expand-state');
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          setState(prev => ({ ...prev, isExpanded: parsed }));
        } catch (error) {
          console.warn('Failed to parse saved expand button state:', error);
        }
      }
    }
  }, []);

  // Computed Properties
  const buttonClasses = [
    'expand-button',
    `expand-button--${size}`,
    `expand-button--${theme}`,
    state.isExpanded ? 'expand-button--expanded' : '',
    state.isHovered ? 'expand-button--hovered' : '',
    state.isFocused ? 'expand-button--focused' : '',
    disabled ? 'expand-button--disabled' : '',
    loading ? 'expand-button--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  const tooltipText = state.isExpanded ? 'Contrair' : 'Expandir';
  const buttonAriaLabel = ariaLabel || tooltipText;

  const getIconSize = (size: string): number => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };

  return (
    <div className="expand-button-container">
      <button
        className={buttonClasses}
        style={style}
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label={buttonAriaLabel}
        aria-expanded={state.isExpanded}
        aria-disabled={disabled || loading}
        disabled={disabled || loading}
        type="button"
      >
        {loading ? (
          <div className="expand-button__spinner" />
        ) : (
          <>
            <Maximize2 
              className={`expand-button__icon expand-button__icon--expand ${
                !state.isExpanded ? 'expand-button__icon--active' : ''
              }`}
              size={getIconSize(size)}
            />
            <Minimize2 
              className={`expand-button__icon expand-button__icon--collapse ${
                state.isExpanded ? 'expand-button__icon--active' : ''
              }`}
              size={getIconSize(size)}
            />
          </>
        )}
      </button>
      
      {showTooltip && (
        <div 
          className={`expand-button__tooltip expand-button__tooltip--${tooltipPosition} ${
            state.isHovered ? 'expand-button__tooltip--visible' : ''
          }`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default ExpandButton;