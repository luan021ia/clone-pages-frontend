import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface URLInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onClone: () => void;
  disabled?: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({
  url,
  onUrlChange,
  onClone,
  disabled = false
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url.trim() && !disabled) {
      e.preventDefault();
      onClone();
    }
  };

  return (
    <div className="input-section">
      <Input
        value={url}
        onChange={onUrlChange}
        placeholder="Digite a URL da página que deseja clonar"
        className="url-input"
        onKeyDown={handleKeyDown}
        disabled={disabled}
        type="url"
      />
      <Button
        onClick={onClone}
        disabled={disabled || !url.trim()}
      >
        Clonar
      </Button>
    </div>
  );
};