import React, { useState, useEffect } from 'react';
import { Exam, Appointment, examService, appointmentService } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<number | ''>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadExams();
    loadAppointments();
  }, []);

  const loadExams = async () => {
    try {
      const response = await examService.getAll();
      setExams(response.data);
    } catch (err) {
      setError('Erro ao carregar exames');
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await appointmentService.getAll();
      setAppointments(response.data);
    } catch (err) {
      setError('Erro ao carregar agendamentos');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamId || !scheduledDate) {
      setError('Selecione um exame e uma data/hora');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await appointmentService.create({
        examId: Number(selectedExamId),
        scheduledDate,
        notes,
      });
      setSelectedExamId('');
      setScheduledDate('');
      setNotes('');
      loadAppointments();
    } catch (err) {
      setError('Erro ao criar agendamento');
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
    } catch (err) {
      setError('Erro ao excluir agendamento');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Aspect - Agendamento de Exames</h1>
      </header>

      <main className="container">
        {error && <div className="error-message">{error}</div>}

        <section className="exams-section">
          <h2>Exames Disponíveis</h2>
          {exams.length === 0 ? (
            <p className="empty-message">Nenhum exame disponível</p>
          ) : (
            <div className="exams-grid">
              {exams.map((exam) => (
                <div key={exam.id} className="exam-card">
                  <h3>{exam.name}</h3>
                  <p className="specialty">{exam.specialty}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="appointment-form-section">
          <h2>Novo Agendamento</h2>
          <form onSubmit={handleSubmit} className="appointment-form">
            <div className="form-group">
              <label htmlFor="exam">Exame:</label>
              <select
                id="exam"
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value ? Number(e.target.value) : '')}
                required
                disabled={exams.length === 0}
              >
                <option value="">Selecione um exame</option>
                {exams.map((exam) => (
                  <option key={exam.id} value={exam.id}>
                    {exam.name} - {exam.specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Data e Hora:</label>
              <input
                type="datetime-local"
                id="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Observações:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informações adicionais (opcional)"
                rows={3}
              />
            </div>

            <button type="submit" disabled={loading || exams.length === 0}>
              {loading ? 'Agendando...' : 'Agendar Exame'}
            </button>
          </form>
        </section>

        <section className="appointments-section">
          <h2>Agendamentos</h2>
          {appointments.length === 0 ? (
            <p className="empty-message">Nenhum agendamento realizado</p>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-info">
                    <h3>{appointment.exam?.name || 'Exame não encontrado'}</h3>
                    <p className="specialty">{appointment.exam?.specialty}</p>
                    <p className="date">
                      <strong>Data/Hora:</strong> {formatDate(appointment.scheduledDate)}
                    </p>
                    {appointment.notes && (
                      <p className="notes">
                        <strong>Observações:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(appointment.id)}
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
