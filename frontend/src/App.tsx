import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

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

  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
