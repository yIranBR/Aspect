import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, setUser } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  // Apply theme on component mount and when theme changes
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSaveProfile = async () => {
    if (!profileData.name || !profileData.email) {
      setError('Nome e email são obrigatórios');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authService.updateProfile({
        name: profileData.name,
        email: profileData.email,
      });
      
      // Atualizar contexto do usuário
      if (setUser) {
        setUser(response.data);
      }
      
      setSuccess('Perfil atualizado com sucesso!');
      setIsEditingProfile(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setSuccess('Tema alterado com sucesso!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="settings"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="section-header">
        <h2>
          <i className="fas fa-cog"></i>
          Configurações da Conta
        </h2>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      <motion.div className="settings-card" variants={cardVariants}>
        <div className="settings-card-header">
          <i className="fas fa-user"></i>
          <h3>Informações da Conta</h3>
        </div>
        <div className="settings-card-body">
          {isEditingProfile ? (
            <>
              <div className="settings-info">
                <label>Nome:</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="settings-input"
                />
              </div>
              <div className="settings-info">
                <label>Email:</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="settings-input"
                />
              </div>
              <div className="settings-info">
                <label>Tipo de Conta:</label>
                <p className="account-badge">
                  {user?.role === 'admin' ? 'Administrador' : 'Paciente'}
                </p>
              </div>
              <div className="profile-actions">
                <button className="btn-secondary" onClick={() => setIsEditingProfile(false)} disabled={loading}>
                  <i className="fas fa-times"></i>
                  Cancelar
                </button>
                <button className="btn-secondary btn-save-profile" onClick={handleSaveProfile} disabled={loading}>
                  <i className="fas fa-save"></i>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="settings-info">
                <label>Nome:</label>
                <p>{user?.name}</p>
              </div>
              <div className="settings-info">
                <label>Email:</label>
                <p>{user?.email}</p>
              </div>
              <div className="settings-info">
                <label>Tipo de Conta:</label>
                <p className="account-badge">
                  {user?.role === 'admin' ? 'Administrador' : 'Paciente'}
                </p>
              </div>
              <button className="btn-secondary" onClick={() => setIsEditingProfile(true)}>
                <i className="fas fa-edit"></i>
                Editar Perfil
              </button>
            </>
          )}
        </div>
      </motion.div>

      <motion.div className="settings-card" variants={cardVariants}>
        <div className="settings-card-header">
          <i className="fas fa-palette"></i>
          <h3>Aparência</h3>
        </div>
        <div className="settings-card-body">
          <p className="settings-description">
            Escolha o tema de sua preferência para o sistema
          </p>
          <div className="theme-selector">
            <button
              className={`theme-option ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
            >
              <div className="theme-preview light">
                <i className="fas fa-sun"></i>
              </div>
              <span>Tema Claro</span>
            </button>
            <button
              className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
            >
              <div className="theme-preview dark">
                <i className="fas fa-moon"></i>
              </div>
              <span>Tema Escuro</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div className="settings-card" variants={cardVariants}>
        <div className="settings-card-header">
          <i className="fas fa-bell"></i>
          <h3>Notificações</h3>
        </div>
        <div className="settings-card-body">
          <div className="settings-toggle">
            <div className="toggle-info">
              <label>Notificações no Sistema</label>
              <p>Receber alertas de novos agendamentos e lembretes</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="settings-toggle">
            <div className="toggle-info">
              <label>Notificações por Email</label>
              <p>Receber emails de confirmação e lembretes</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </motion.div>

      <motion.div className="settings-card settings-card-disabled" variants={cardVariants}>
        <div className="settings-card-header">
          <i className="fas fa-shield-alt"></i>
          <h3>Segurança</h3>
        </div>
        <div className="settings-card-body">
          <button className="btn-secondary" disabled>
            <i className="fas fa-key"></i>
            Alterar Senha
          </button>
          <button className="btn-secondary" disabled>
            <i className="fas fa-mobile-alt"></i>
            Ativar Autenticação em 2 Fatores
          </button>
          <p className="disabled-notice">
            <i className="fas fa-lock"></i>
            Funcionalidade em desenvolvimento
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;
