import React from 'react';
import { Button } from '../ui/Button';
import type { ViewportMode } from '../../types/viewport.types';
import { VIEWPORT_LABELS } from '../../constants/app.constants';

interface ViewportControlsProps {
  currentMode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
}

export const ViewportControls: React.FC<ViewportControlsProps> = ({
  currentMode,
  onModeChange
}) => {
  const modes: ViewportMode[] = ['desktop', 'mobile'];

  return (
    <div className="viewport-controls">
      {modes.map((mode) => (
        <Button
          key={mode}
          onClick={() => onModeChange(mode)}
          variant={currentMode === mode ? 'primary' : 'secondary'}
          size="small"
        >
          {VIEWPORT_LABELS[mode]}
        </Button>
      ))}
    </div>
  );
};