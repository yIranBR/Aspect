import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Appointment, appointmentService, examService, Exam, authService, User } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import BusinessHoursCalendar from './BusinessHoursCalendar';
import Sidebar from './Sidebar';
import DoctorsManagement from './DoctorsManagement';
import ExamsManagement from './ExamsManagement';
import Settings from './Settings';
import './DashboardAdmin.css';

interface CreateModalData {
  userId: number;
  examId: number;
  scheduledDate: string;
  notes: string;
}

const DashboardAdmin: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<string>('appointments');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<CreateModalData>({
    userId: 0,
    examId: 0,
    scheduledDate: '',
    notes: '',
  });
  const { user, logout } = useAuth();

  useEffect(() => {
    loadAppointments();
    loadExams();
    loadUsers();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar agendamentos');
    }
  };

  const loadExams = async () => {
    try {
      const response = await examService.getAll();
      setExams(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar exames');
    }
  };

  const loadUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      setUsers(response.data.filter((u: User) => u.role === 'patient'));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao carregar pacientes');
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingId(appointment.id);
    // Usar date ou scheduledDate
    let dateValue = appointment.date || appointment.scheduledDate;
    // Converter para formato YYYY-MM-DDTHH:mm para o calendar
    let formattedDate = dateValue;
    if (formattedDate) {
      // Se vier no formato ISO completo, pegar apenas data e hora
      const d = new Date(formattedDate);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    setFormData({
      userId: appointment.userId,
      examId: appointment.examId,
      scheduledDate: formattedDate,
      notes: appointment.notes || '',
    });
    setShowModal(true);
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      userId: 0,
      examId: 0,
      scheduledDate: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.userId || !formData.examId || !formData.scheduledDate) {
      setError('Preencha todos os campos obrigatórios');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editingId) {
        // Update existing appointment
        await appointmentService.update(editingId, {
          examId: formData.examId,
          scheduledDate: formData.scheduledDate,
          notes: formData.notes,
        });
      } else {
        // Create new appointment
        await appointmentService.create({
          userId: formData.userId,
          examId: formData.examId,
          scheduledDate: formData.scheduledDate,
          notes: formData.notes,
        });
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({
        userId: 0,
        examId: 0,
        scheduledDate: '',
        notes: '',
      });
      await loadAppointments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao salvar agendamento');
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
      loadAppointments();
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
      console.error('Erro ao formatar data:', dateString, err);
      return 'Data inválida';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'appointments':
        return renderAppointmentsSection();
      case 'doctors':
        return <DoctorsManagement />;
      case 'exams':
        return <ExamsManagement />;
      case 'settings':
        return <Settings />;
      default:
        return renderAppointmentsSection();
    }
  };

  const renderAppointmentsSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {error && <div className="admin-error-message">{error}</div>}

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>
            <i className="fas fa-calendar-check"></i>
            Gerenciamento de Agendamentos
          </h2>
          <div className="admin-stats">
            <span className="admin-stat">
              <i className="fas fa-list"></i>
              Total: {appointments.length}
            </span>
            <button className="btn-add" onClick={handleOpenCreateModal}>
              <i className="fas fa-plus"></i>
              Novo Agendamento
            </button>
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="admin-empty">
            <i className="fas fa-inbox"></i>
            <p>Nenhum agendamento realizado</p>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Paciente</th>
                  <th>Email</th>
                  <th>Exame</th>
                  <th>Especialidade</th>
                  <th>Data/Hora</th>
                  <th>Observações</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <motion.tr
                    key={appointment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: '#f5f5f5' }}
                  >
                    <td>#{appointment.id}</td>
                    <td>
                      <div className="patient-cell">
                        <i className="fas fa-user"></i>
                        {appointment.user?.name || 'N/A'}
                      </div>
                    </td>
                    <td>{appointment.user?.email || 'N/A'}</td>
                    <td>
                      <strong>{appointment.exam?.name || 'N/A'}</strong>
                    </td>
                    <td>
                      <span className="specialty-badge">
                        {appointment.exam?.specialty || 'N/A'}
                      </span>
                    </td>
                    <td>{formatDate(appointment.date || appointment.scheduledDate)}</td>
                    <td className="notes-cell">
                      {appointment.notes || <em>Sem observações</em>}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(appointment)}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(appointment.id)}
                          title="Excluir"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Único para Criar/Editar */}
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
                <i className={`fas fa-${editingId ? 'edit' : 'plus-circle'}`}></i>
                {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>
                    Paciente: <span className="required">*</span>
                  </label>
                  <select
                    value={formData.userId}
                    onChange={(e) =>
                      setFormData({ ...formData, userId: Number(e.target.value) })
                    }
                    disabled={editingId !== null}
                    className={editingId !== null ? 'input-disabled' : ''}
                  >
                    <option value={0}>Selecione um paciente</option>
                    {users.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.email})
                      </option>
                    ))}
                  </select>
                  {editingId && (
                    <small className="field-help">
                      <i className="fas fa-info-circle"></i>
                      O paciente não pode ser alterado
                    </small>
                  )}
                </div>

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
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Criar Agendamento'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="admin-dashboard-wrapper">
      {/* Mobile Header with Hamburger */}
      <div className="mobile-header">
        <button 
          className="hamburger-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Menu"
        >
          <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        <h1>
          <i className="fas fa-hospital-symbol"></i>
          Aspect Hospital
        </h1>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setIsSidebarOpen(false); // Close sidebar on mobile after selection
        }}
        onLogout={logout}
        userName={user?.name || ''}
        isMobileOpen={isSidebarOpen}
      />
      <main className="admin-main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashboardAdmin;
