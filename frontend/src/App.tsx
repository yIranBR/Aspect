import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DashboardAdmin from './components/DashboardAdmin';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // Aplicar tema salvo no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        {showRegister ? <Register /> : <Login />}
        <div className="auth-switch">
          <button onClick={() => setShowRegister(!showRegister)}>
            {showRegister ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    );
  }

  return isAdmin ? <DashboardAdmin /> : <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
