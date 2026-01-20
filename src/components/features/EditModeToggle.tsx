import React from 'react';
import { Toggle } from '../ui/Toggle';

interface EditModeToggleProps {
  editMode: boolean;
  onEditModeChange: (editMode: boolean) => void;
  disabled?: boolean;
}

export const EditModeToggle: React.FC<EditModeToggleProps> = ({
  editMode,
  onEditModeChange,
  disabled = false
}) => {
  return (
    <div className="edit-mode">
      <label>Modo Edição:</label>
      <Toggle
        checked={editMode}
        onChange={onEditModeChange}
        disabled={disabled}
      />
    </div>
  );
};