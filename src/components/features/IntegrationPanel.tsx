import React from 'react';
import { Input } from '../ui/Input';
import { Toggle } from '../ui/Toggle';
import { INTEGRATION_FIELDS } from '../../constants/app.constants';
import type { IntegrationConfig, IntegrationToggles } from '../../types/integration.types';

interface IntegrationPanelProps {
  integrations: IntegrationConfig;
  toggles: IntegrationToggles;
  onIntegrationChange: (key: keyof IntegrationConfig, value: string) => void;
  onToggleChange: (key: keyof IntegrationToggles, value: boolean) => void;
}

export const IntegrationPanel: React.FC<IntegrationPanelProps> = ({
  integrations,
  toggles,
  onIntegrationChange,
  onToggleChange
}) => {
  return (
    <div className="integrations">
      {INTEGRATION_FIELDS.map((field) => (
        <div key={field.key} className="integration">
          <label>{field.label}</label>
          <Input
            value={integrations[field.key]}
            onChange={(value) => onIntegrationChange(field.key, value)}
            placeholder={field.placeholder}
          />
          <Toggle
            checked={toggles[field.toggleKey]}
            onChange={(checked) => onToggleChange(field.toggleKey, checked)}
          />
        </div>
      ))}
    </div>
  );
};