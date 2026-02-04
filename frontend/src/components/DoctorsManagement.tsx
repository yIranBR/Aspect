import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authService, User } from '../services/api';
import './DoctorsManagement.css';

const DoctorsManagement: React.FC = () => {
  const [doctors, setDoctors] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'patient',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const response = await authService.getAllUsers();
      setDoctors(response.data.filter((u: User) => u.role === 'admin'));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar médicos');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.register(formData);
      await loadDoctors();
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'admin' });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar médico/admin');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="doctors-management"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="section-header">
        <h2>
          <i className="fas fa-user-md"></i>
          Gestão de Médicos e Administradores
        </h2>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i>
          Novo Médico/Admin
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <motion.div
            key={doctor.id}
            className="exam-card"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <div className="doctor-avatar">
              <i className="fas fa-user-md"></i>
            </div>
            <h3>{doctor.name}</h3>
            <p>{doctor.email}</p>
            <span className="doctor-badge">Administrador</span>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="modal-header">
              <h3>
                <i className="fas fa-user-plus"></i>
                Novo Médico/Administrador
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nome Completo: <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. João Silva"
                />
              </div>

              <div className="form-group">
                <label>Email: <span className="required">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="medico@aspect.com"
                />
              </div>

              <div className="form-group">
                <label>Senha: <span className="required">*</span></label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Criando...' : 'Criar Médico/Admin'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default DoctorsManagement;
