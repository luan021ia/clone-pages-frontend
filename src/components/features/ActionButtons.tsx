import React from 'react';
import { Button } from '../ui/Button';

interface ActionButtonsProps {
  onCopyOriginal: () => void;
  onCopyEdited: () => void;
  onDownloadOriginal: () => void;
  onDownloadEdited: () => void;
  onCleanCodes: () => void;
  onReset: () => void;
  disabled?: boolean;
  editMode: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopyOriginal,
  onCopyEdited,
  onDownloadOriginal,
  onDownloadEdited,
  onCleanCodes,
  onReset,
  disabled = false,
  editMode
}) => {
  return (
    <div className="actions">
      <Button onClick={onCopyOriginal} disabled={disabled}>
        Copiar HTML Original
      </Button>
      
      {editMode && (
        <Button onClick={onCopyEdited} disabled={disabled}>
          Copiar HTML Editado
        </Button>
      )}
      
      <Button onClick={onDownloadOriginal} disabled={disabled}>
        Baixar HTML Original
      </Button>
      
      {editMode && (
        <Button onClick={onDownloadEdited} disabled={disabled}>
          Baixar HTML Editado
        </Button>
      )}
      
      <Button onClick={onCleanCodes} disabled={disabled} variant="secondary">
        Limpar Códigos de Rastreamento
      </Button>
      
      <Button onClick={onReset} variant="danger">
        Resetar
      </Button>
    </div>
  );
};