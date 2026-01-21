import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { User, LicenseInfo } from '../services/authService';
// import { PaymentPlatformsManager } from '../components/features/admin/PaymentPlatformsManager';
// Componente removido temporariamente - será implementado em breve
import './Admin.css';

interface UserWithLicense extends User {
  license?: LicenseInfo;
}

export const Admin: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserWithLicense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create User Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createCpf, setCreateCpf] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createLicenseDays, setCreateLicenseDays] = useState('365');
  const [createRole, setCreateRole] = useState<'user' | 'admin'>('user');
  const [creating, setCreating] = useState(false);

  // Edit User Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithLicense | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editCpf, setEditCpf] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');
  const [renewDays, setRenewDays] = useState('365');
  const [setDaysManual, setSetDaysManual] = useState('365');
  const [bonusDays, setBonusDays] = useState('');
  const [updating, setUpdating] = useState(false);
  const [lastUserCount, setLastUserCount] = useState(0);
  const [newUsersDetected, setNewUsersDetected] = useState(false);

  const loadUsers = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError('');

      let allUsers: UserWithLicense[] = [];
      try {
        allUsers = await authService.getAllUsers();
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar lista de usuários');
        if (!silent) {
          setLoading(false);
        }
        return;
      }

      // Detectar novos usuários (comparar com contagem anterior)
      setLastUserCount((prevCount) => {
        if (prevCount > 0 && allUsers.length > prevCount) {
          const newCount = allUsers.length - prevCount;
          setNewUsersDetected(true);
          // Auto-hide após 5 segundos
          setTimeout(() => setNewUsersDetected(false), 5000);
        }
        return allUsers.length;
      });

      // Carregar informações de licença para cada usuário com tratamento individual
      const usersWithLicense = await Promise.all(
        allUsers.map(async (u) => {
          try {
            const license = await authService.getUserLicense(u.id);
            return { ...u, license };
          } catch (err) {
            // Usuário é retornado sem licença se falhar
            return { ...u, license: undefined };
          }
        })
      );

      setUsers(usersWithLicense);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
      return;
    }
    loadUsers();
    
    // Polling automático a cada 30 segundos para detectar novos usuários da Kiwify
    const pollingInterval = setInterval(() => {
      loadUsers(true); // true = silent mode (não mostra loading)
    }, 30000); // 30 segundos

    return () => clearInterval(pollingInterval);
  }, [isAdmin, navigate, loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createName || !createEmail || !createPassword) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (createPassword.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setCreating(true);

    try {
      await authService.createUser(
        createEmail,
        createPassword,
        parseInt(createLicenseDays),
        createRole,
        createName,
        createCpf || undefined,
        createPhone || undefined
      );

      alert('Usuário criado com sucesso!');
      setShowCreateModal(false);
      setCreateName('');
      setCreateEmail('');
      setCreatePassword('');
      setCreateCpf('');
      setCreatePhone('');
      setCreateLicenseDays('365');
      setCreateRole('user');
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao criar usuário');
    } finally {
      setCreating(false);
    }
  };

  const handleEditUser = (u: UserWithLicense) => {
    setEditingUser(u);
    setEditName(u.name || '');
    setEditEmail(u.email);
    setEditCpf(u.cpf || '');
    setEditPhone(u.phone || '');
    setEditRole(u.role);
    setEditPassword('');
    setRenewDays('365');
    setBonusDays('');
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    setUpdating(true);

    try {
      // Verificar se há mudanças em name, email, role, cpf ou phone
      const hasChanges = 
        editName !== editingUser.name ||
        editEmail !== editingUser.email || 
        editRole !== editingUser.role ||
        editCpf !== (editingUser.cpf || '') ||
        editPhone !== (editingUser.phone || '');

      if (hasChanges) {
        await authService.updateUser(editingUser.id, {
          name: editName,
          email: editEmail,
          role: editRole,
          cpf: editCpf || undefined,
          phone: editPhone || undefined
        });
      }

      // Atualizar senha se fornecida
      if (editPassword) {
        if (editPassword.length < 6) {
          alert('A senha deve ter no mínimo 6 caracteres');
          setUpdating(false);
          return;
        }
        await authService.updateUserPassword(editingUser.id, editPassword);
      }

      alert('Usuário atualizado com sucesso!');
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar usuário');
    } finally {
      setUpdating(false);
    }
  };

  const handleRenewLicense = async () => {
    if (!editingUser) return;

    const days = parseInt(renewDays);
    if (isNaN(days) || days < 1) {
      alert('Digite um número válido de dias');
      return;
    }

    setUpdating(true);

    try {
      await authService.renewUserLicense(editingUser.id, days);
      alert(`Licença renovada por ${days} dias!`);
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao renovar licença');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeactivateLicense = async () => {
    if (!editingUser) return;

    if (!confirm('Tem certeza que deseja DESATIVAR a licença deste usuário? Ele perderá o acesso imediatamente.')) {
      return;
    }

    setUpdating(true);

    try {
      await authService.deactivateUserLicense(editingUser.id);
      alert('Licença desativada com sucesso!');
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao desativar licença');
    } finally {
      setUpdating(false);
    }
  };

  const handleReactivateLicense = async () => {
    if (!editingUser) return;

    const days = parseInt(renewDays);
    if (isNaN(days) || days < 1) {
      alert('Digite um número válido de dias');
      return;
    }

    setUpdating(true);

    try {
      await authService.reactivateUserLicense(editingUser.id, days);
      alert(`Licença reativada por ${days} dias!`);
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao reativar licença');
    } finally {
      setUpdating(false);
    }
  };

  const handleSetLicenseDays = async () => {
    if (!editingUser) return;

    const days = parseInt(setDaysManual);
    if (isNaN(days) || days < 0) {
      alert('Digite um número válido de dias (0 ou mais)');
      return;
    }

    setUpdating(true);

    try {
      await authService.setUserLicenseDays(editingUser.id, days);
      alert(`Licença definida para ${days} dias a partir de agora!`);
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao definir dias de licença');
    } finally {
      setUpdating(false);
    }
  };

  const handleBonusDays = async () => {
    if (!editingUser) return;
    
    const days = parseInt(bonusDays);
    if (isNaN(days) || days < 1) {
      alert('Digite um número válido de dias (mínimo 1)');
      return;
    }
    
    setUpdating(true);
    
    try {
      await authService.renewUserLicense(editingUser.id, days);
      alert(`${days} dias bonificados com sucesso!`);
      setBonusDays('');
      setShowEditModal(false);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao bonificar dias');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja deletar este usuário?')) {
      return;
    }

    try {
      await authService.deleteUser(userId);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao deletar usuário');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getLicenseStatusBadge = (license?: LicenseInfo) => {
    if (!license) {
      return <span className="badge badge-inactive">Sem licença</span>;
    }

    if (license.status === 'admin') {
      return <span className="badge badge-admin">Admin (Ilimitado)</span>;
    }

    if (license.status === 'expired') {
      return <span className="badge badge-expired">Expirada</span>;
    }

    if (license.status === 'expiring_soon') {
      return <span className="badge badge-warning">Expirando em {license.daysRemaining} dias</span>;
    }

    if (license.status === 'active') {
      return <span className="badge badge-active">Ativa ({license.daysRemaining} dias)</span>;
    }

    return <span className="badge badge-inactive">Inativa</span>;
  };

  return (
    <div className="admin">
      {/* Header */}
      <div className="admin-header">
        <div className="header-left">
          <img src="/spycopy-logo.png" alt="CLONE PAGES" className="header-logo" />
          <h1 className="header-title">PAINEL ADMIN</h1>
        </div>

        <div className="header-right">
          <span className="user-email">{user?.email}</span>
          <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
            ← Voltar ao Dashboard
          </button>
          <button className="btn-logout" onClick={logout}>
            Sair
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-container">
          <div className="admin-card">
            <div className="card-header">
              <h2>Gerenciar Usuários</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-create" onClick={() => setShowCreateModal(true)}>
                  ➕ Novo Usuário
                </button>
                <button className="btn-refresh" onClick={() => loadUsers(false)}>
                  🔄 Atualizar
                </button>
                {newUsersDetected && (
                  <div style={{
                    marginLeft: '12px',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    ✅ Novo usuário detectado!
                  </div>
                )}
              </div>
            </div>

            {loading && (
              <div className="loading">Carregando usuários...</div>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}

            {!loading && !error && (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>E-mail</th>
                      <th>CPF</th>
                      <th>Telefone</th>
                      <th>Role</th>
                      <th>Status da Licença</th>
                      <th>Expira em</th>
                      <th>Criado em</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.length > 0 && users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name || '-'}</td>
                        <td>{u.email}</td>
                        <td>{u.cpf || '-'}</td>
                        <td>{u.phone || '-'}</td>
                        <td>
                          <span className={`role-badge role-${u.role}`}>
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td>{getLicenseStatusBadge(u.license)}</td>
                        <td>{formatDate(u.license?.expiresAt || null)}</td>
                        <td>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className="btn-edit"
                              onClick={() => handleEditUser(u)}
                              disabled={u.id === user?.id}
                            >
                              ✏️
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === user?.id}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && (
                  <div className="no-users">Nenhum usuário encontrado</div>
                )}
              </div>
            )}

            {!loading && !error && users && (
              <div className="admin-stats">
                <div className="stat-card">
                  <div className="stat-value">{users.length}</div>
                  <div className="stat-label">Total de Usuários</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
                  <div className="stat-label">Administradores</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {users.filter(u => u.license?.isActive && u.role === 'user').length}
                  </div>
                  <div className="stat-label">Licenças Ativas</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    {users.filter(u => u.license?.status === 'expired' || u.license?.status === 'inactive').length}
                  </div>
                  <div className="stat-label">Licenças Expiradas</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Criar Novo Usuário</h3>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="modal-form">
              {/* Dados Pessoais - 2 colunas */}
              <div className="form-section">
                <h4 className="form-section-title">Dados Pessoais</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-name">Nome *</label>
                    <input
                      id="create-name"
                      type="text"
                      value={createName}
                      onChange={(e) => setCreateName(e.target.value)}
                      placeholder="Nome completo"
                      disabled={creating}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="create-email">E-mail *</label>
                    <input
                      id="create-email"
                      type="email"
                      value={createEmail}
                      onChange={(e) => setCreateEmail(e.target.value)}
                      placeholder="usuario@exemplo.com"
                      disabled={creating}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-password">Senha *</label>
                    <input
                      id="create-password"
                      type="password"
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      disabled={creating}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="create-cpf">CPF</label>
                    <input
                      id="create-cpf"
                      type="text"
                      value={createCpf}
                      onChange={(e) => setCreateCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      disabled={creating}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-phone">Telefone</label>
                    <input
                      id="create-phone"
                      type="text"
                      value={createPhone}
                      onChange={(e) => setCreatePhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      disabled={creating}
                    />
                  </div>
                </div>
              </div>

              {/* Configurações - 2 colunas */}
              <div className="form-section">
                <h4 className="form-section-title">Configurações</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="create-license">Duração da Licença</label>
                    <select
                      id="create-license"
                      value={createLicenseDays}
                      onChange={(e) => setCreateLicenseDays(e.target.value)}
                      disabled={creating}
                      className="form-select"
                    >
                      <option value="365">365 dias (1 ano)</option>
                      <option value="30">30 dias (1 mês)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="create-role">Tipo de Usuário</label>
                    <select
                      id="create-role"
                      value={createRole}
                      onChange={(e) => setCreateRole(e.target.value as 'user' | 'admin')}
                      disabled={creating}
                      className="form-select"
                    >
                      <option value="user">User (Acesso Normal)</option>
                      <option value="admin">Admin (Acesso Total)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                  disabled={creating}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={creating}>
                  {creating ? 'Criando...' : 'Criar Usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar Usuário</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>

            <form onSubmit={handleUpdateUser} className="modal-form">
              {/* Cabeçalho com Status */}
              <div className="user-info-header">
                <div className="user-info-badge">
                  <strong>{editingUser.name || 'Sem nome'}</strong>
                  {editingUser.license && getLicenseStatusBadge(editingUser.license)}
                </div>
                <div className="user-info-dates">
                  {editingUser.license?.expiresAt && (
                    <span className="expiry-info">
                      Expira em: <strong>{formatDate(editingUser.license.expiresAt)}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Dados Pessoais e Segurança - 3 colunas */}
              <div className="form-section">
                <h4 className="form-section-title">Dados Pessoais</h4>
                <div className="form-row-3">
                  <div className="form-group">
                    <label htmlFor="edit-name">Nome</label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nome completo"
                      disabled={updating}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-email">E-mail</label>
                    <input
                      id="edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="usuario@exemplo.com"
                      disabled={updating}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-role">Tipo de Usuário</label>
                    <select
                      id="edit-role"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as 'user' | 'admin')}
                      disabled={updating}
                      className="form-select"
                    >
                      <option value="user">User (Acesso Normal)</option>
                      <option value="admin">Admin (Acesso Total)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label htmlFor="edit-cpf">CPF</label>
                    <input
                      id="edit-cpf"
                      type="text"
                      value={editCpf}
                      onChange={(e) => setEditCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      disabled={updating}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-phone">Telefone</label>
                    <input
                      id="edit-phone"
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      disabled={updating}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="edit-password">Nova Senha (opcional)</label>
                    <input
                      id="edit-password"
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Deixe vazio para não alterar"
                      disabled={updating}
                    />
                  </div>
                </div>
              </div>

              {/* Gerenciamento de Licença */}
              <div className="form-section">
                <h4 className="form-section-title">Gerenciamento de Licença</h4>

                {/* Ações de Licença em Grid */}
                <div className="license-actions-grid">
                {/* Definir Dias Manualmente */}
                <div className="license-action-card">
                  <label htmlFor="set-days">Definir dias exatos</label>
                  <div className="input-button-group">
                    <input
                      type="number"
                      id="set-days"
                      value={setDaysManual}
                      onChange={(e) => setSetDaysManual(e.target.value)}
                      disabled={updating}
                      className="form-input"
                      min="0"
                      placeholder="Ex: 365"
                    />
                    <button
                      type="button"
                      className="btn-set-days"
                      onClick={handleSetLicenseDays}
                      disabled={updating}
                    >
                      Definir
                    </button>
                  </div>
                  <small>Define dias exatos a partir de hoje (substitui licença atual)</small>
                </div>

                {/* Renovar/Adicionar/Bonificar Dias */}
                <div className="license-action-card">
                  <label htmlFor="renew-days">Adicionar/Bonificar dias</label>
                  
                  {/* Opção 1: Select rápido com valores pré-definidos */}
                  <div style={{ marginBottom: '12px' }}>
                    <div className="input-button-group">
                      <select
                        id="renew-days"
                        value={renewDays}
                        onChange={(e) => setRenewDays(e.target.value)}
                        disabled={updating}
                        className="form-select"
                      >
                        <option value="7">7 dias</option>
                        <option value="30">30 dias</option>
                        <option value="90">90 dias</option>
                        <option value="180">180 dias</option>
                        <option value="365">365 dias</option>
                        <option value="730">730 dias</option>
                      </select>
                      <button
                        type="button"
                        className="btn-renew"
                        onClick={handleRenewLicense}
                        disabled={updating}
                      >
                        🔄 Adicionar
                      </button>
                    </div>
                  </div>

                  {/* Opção 2: Input manual para bonificação personalizada */}
                  <div className="input-button-group">
                    <input
                      type="number"
                      id="bonus-days"
                      value={bonusDays}
                      onChange={(e) => setBonusDays(e.target.value)}
                      placeholder="Quantidade personalizada"
                      disabled={updating}
                      className="form-input"
                      min="1"
                    />
                    <button
                      type="button"
                      className="btn-set-days"
                      onClick={handleBonusDays}
                      disabled={updating}
                    >
                      Bonificar
                    </button>
                  </div>
                  <small>Adiciona à licença atual ou bonificação personalizada</small>
                </div>
              </div>

              {/* Botões de Ação (Desativar/Reativar) */}
              {editingUser.license && editingUser.license.status !== 'admin' && (
                <div className="license-toggle-actions">
                  {editingUser.license.isActive ? (
                    <button
                      type="button"
                      className="btn-deactivate"
                      onClick={handleDeactivateLicense}
                      disabled={updating}
                    >
                      🚫 Desativar Licença
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn-reactivate"
                      onClick={handleReactivateLicense}
                      disabled={updating}
                    >
                      ✅ Reativar Licença ({renewDays} dias)
                    </button>
                  )}
                </div>
              )}
              </div>

              <div className="modal-actions" style={{ marginTop: '12px', marginBottom: '0' }}>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowEditModal(false)}
                  disabled={updating}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={updating}>
                  {updating ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
