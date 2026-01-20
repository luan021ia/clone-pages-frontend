import React, { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import type { LicenseInfo } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import './LicenseStatus.css';

export const LicenseStatus: React.FC = () => {
  const { user } = useAuth();
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLicense = async () => {
      if (!user) return;

      try {
        const licenseInfo = await authService.getUserLicense(user.id);
        setLicense(licenseInfo || null);
      } catch (error) {
        console.error('Error loading license:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLicense();
  }, [user]);

  if (loading) {
    return null;
  }

  if (!license) {
    return null;
  }

  // Admin não precisa ver status de licença
  if (license.isAdmin) {
    return (
      <div className="license-status license-admin">
        <span className="license-icon">👑</span>
        <span className="license-text">Administrador</span>
      </div>
    );
  }

  // Licença expirada
  if (license.status === 'expired') {
    return (
      <div className="license-status license-expired">
        <span className="license-icon">🚫</span>
        <span className="license-text">Licença Expirada</span>
      </div>
    );
  }

  // Licença expirando em breve (menos de 7 dias)
  if (license.status === 'expiring_soon') {
    return (
      <div className="license-status license-warning">
        <span className="license-icon">⚠️</span>
        <span className="license-text">
          Expira em {license.daysRemaining} {license.daysRemaining === 1 ? 'dia' : 'dias'}
        </span>
      </div>
    );
  }

  // Licença ativa
  if (license.status === 'active') {
    const expiresDate = license.expiresAt ? new Date(license.expiresAt).toLocaleDateString('pt-BR') : '';

    return (
      <div className="license-status license-active">
        <span className="license-icon">✅</span>
        <span className="license-text">
          Licença Ativa até {expiresDate}
        </span>
      </div>
    );
  }

  // Sem licença
  return (
    <div className="license-status license-inactive">
      <span className="license-icon">❌</span>
      <span className="license-text">Sem Licença</span>
    </div>
  );
};
