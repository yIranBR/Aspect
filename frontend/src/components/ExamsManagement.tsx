import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { examService, Exam } from '../services/api';
import './ExamsManagement.css';

const ExamsManagement: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    description: '',
  });

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const response = await examService.getAll();
      setExams(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar exames');
    }
  };

  const handleOpenModal = (exam?: Exam) => {
    if (exam) {
      setEditingId(exam.id);
      setFormData({
        name: exam.name,
        specialty: exam.specialty,
        description: exam.description || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', specialty: '', description: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.specialty) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingId) {
        await examService.update(editingId, formData);
      } else {
        await examService.create(formData);
      }
      await loadExams();
      setShowModal(false);
      setFormData({ name: '', specialty: '', description: '' });
      setEditingId(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar exame');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este exame?')) return;

    try {
      await examService.delete(id);
      await loadExams();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir exame');
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
      className="exams-management"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="section-header">
        <h2>
          <i className="fas fa-stethoscope"></i>
          Tipos de Exames Disponíveis
        </h2>
        <button className="btn-add" onClick={() => handleOpenModal()}>
          <i className="fas fa-plus"></i>
          Novo Tipo de Exame
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="exams-grid">
        {exams.map((exam) => (
          <motion.div
            key={exam.id}
            className="exam-card"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <div className="exam-icon">
              <i className="fas fa-stethoscope"></i>
            </div>
            <h3>{exam.name}</h3>
            <span className="exam-specialty">{exam.specialty}</span>
            {exam.description && <p>{exam.description}</p>}
            <div className="exam-actions">
              <button className="btn-edit" onClick={() => handleOpenModal(exam)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="btn-delete" onClick={() => handleDelete(exam.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
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
                <i className={`fas fa-${editingId ? 'edit' : 'plus-circle'}`}></i>
                {editingId ? 'Editar Exame' : 'Novo Tipo de Exame'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Nome do Exame: <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Hemograma Completo"
                />
              </div>

              <div className="form-group">
                <label>Especialidade: <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Ex: Cardiologia"
                />
              </div>

              <div className="form-group">
                <label>Descrição:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Informações adicionais sobre o exame..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Criar Exame'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ExamsManagement;
