import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Exam, Appointment, examService, appointmentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import BusinessHoursCalendar from './BusinessHoursCalendar';

const Dashboard: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    examId: 0,
    scheduledDate: '',
    notes: '',
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    loadExams();
    loadAppointments();
  }, []);

  const loadExams = async () => {
    try {
      const response = await examService.getAll();
      setExams(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar exames');
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar agendamentos');
    }
  };

  const handleOpenModal = () => {
    setFormData({
      examId: 0,
      scheduledDate: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formData.examId || !formData.scheduledDate) {
      setError('Selecione um exame e uma data/hora');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await appointmentService.create({
        examId: formData.examId,
        scheduledDate: formData.scheduledDate,
        notes: formData.notes,
      });
      setShowModal(false);
      setFormData({
        examId: 0,
        scheduledDate: '',
        notes: '',
      });
      await loadAppointments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deseja realmente excluir este agendamento?')) {
      return;
    }

    try {
      await appointmentService.delete(id);
      await loadAppointments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao excluir agendamento');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return 'Data inválida';
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>
          <i className="fas fa-hospital"></i>
          Aspect Hospital
        </h1>
        <div className="header-user-info">
          <span>Olá, {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i>
            Sair
          </button>
        </div>
      </header>

      <main className="container">
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </motion.div>
        )}

        <section className="appointments-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-calendar-alt"></i>
              Meus Agendamentos
            </h2>
            <button className="btn-add" onClick={handleOpenModal}>
              <i className="fas fa-plus"></i>
              Novo Agendamento
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>Nenhum agendamento realizado</p>
              <button className="btn-primary" onClick={handleOpenModal}>
                Criar Primeiro Agendamento
              </button>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  className="appointment-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="appointment-header">
                    <div className="appointment-icon">
                      <i className="fas fa-stethoscope"></i>
                    </div>
                    <div className="appointment-info">
                      <h3>{appointment.exam?.name || 'Exame não encontrado'}</h3>
                      <span className="specialty-badge">
                        {appointment.exam?.specialty}
                      </span>
                    </div>
                  </div>
                  <div className="appointment-body">
                    <p className="date">
                      <i className="fas fa-calendar"></i>
                      <strong>Data/Hora:</strong> {formatDate(appointment.date || appointment.scheduledDate)}
                    </p>
                    {appointment.notes && (
                      <p className="notes">
                        <i className="fas fa-sticky-note"></i>
                        <strong>Observações:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <div className="appointment-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(appointment.id)}
                      title="Excluir agendamento"
                    >
                      <i className="fas fa-trash"></i>
                      Excluir
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div
            className="modal-content modal-large"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="modal-header">
              <h3>
                <i className="fas fa-plus-circle"></i>
                Novo Agendamento
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>
                  Exame: <span className="required">*</span>
                </label>
                <select
                  value={formData.examId}
                  onChange={(e) =>
                    setFormData({ ...formData, examId: Number(e.target.value) })
                  }
                >
                  <option value={0}>Selecione um exame</option>
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.name} - {exam.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  Data e Horário: <span className="required">*</span>
                </label>
                <BusinessHoursCalendar
                  selectedDate={formData.scheduledDate}
                  onChange={(date) =>
                    setFormData({ ...formData, scheduledDate: date })
                  }
                />
                {formData.scheduledDate && (
                  <div className="selected-datetime">
                    <i className="fas fa-check-circle"></i>
                    Agendado para:{' '}
                    {new Date(formData.scheduledDate).toLocaleString('pt-BR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Observações:</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={4}
                  placeholder="Informações adicionais sobre o agendamento..."
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Criando...' : 'Criar Agendamento'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
