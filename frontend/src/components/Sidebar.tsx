import React from 'react';
import { motion } from 'framer-motion';
import './Sidebar.css';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userName: string;
  isMobileOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange, onLogout, userName, isMobileOpen = false }) => {
  const menuItems = [
    { id: 'appointments', icon: 'fa-calendar-check', label: 'Agendamentos' },
    { id: 'doctors', icon: 'fa-user-md', label: 'Médicos/Admins' },
    { id: 'exams', icon: 'fa-stethoscope', label: 'Tipos de Exames' },
    { id: 'settings', icon: 'fa-cog', label: 'Configurações' },
  ];

  return (
    <motion.aside
      className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-hospital-symbol"></i>
          <h2>Aspect</h2>
        </div>
        <div className="sidebar-user">
          <i className="fas fa-user-circle"></i>
          <span>{userName}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
            whileHover={{ scale: 1.05, x: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <motion.button
          className="sidebar-logout"
          onClick={onLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Sair</span>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
