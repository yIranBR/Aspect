import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do transportador SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Formatar data em português
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  }).format(date);
};

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  examName: string;
  examSpecialty: string;
  appointmentDate: Date;
  notes?: string;
}

export const sendAppointmentConfirmationEmail = async (
  data: AppointmentEmailData
): Promise<void> => {
  const { patientName, patientEmail, examName, examSpecialty, appointmentDate, notes } = data;

  const formattedDate = formatDate(appointmentDate);
  const fromName = process.env.SMTP_FROM_NAME || 'Aspect Hospital';
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'noreply@aspect.com';

  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Agendamento</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .header .icon {
      font-size: 50px;
      margin-bottom: 10px;
    }
    .content {
      padding: 30px;
    }
    .greeting {
      font-size: 18px;
      color: #1b5e20;
      margin-bottom: 20px;
    }
    .info-box {
      background: #e8f5e9;
      border-left: 4px solid #4caf50;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .info-item {
      margin: 12px 0;
      font-size: 16px;
    }
    .info-label {
      font-weight: 600;
      color: #2e7d32;
      display: inline-block;
      min-width: 120px;
    }
    .info-value {
      color: #333;
    }
    .date-highlight {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      margin: 20px 0;
    }
    .notes {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .footer {
      background: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
    }
    .footer strong {
      color: #2e7d32;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">🏥</div>
      <h1>Aspect Hospital</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Confirmação de Agendamento</p>
    </div>
    
    <div class="content">
      <p class="greeting">Olá, <strong>${patientName}</strong>!</p>
      
      <p>Seu agendamento foi confirmado com sucesso. Segue abaixo os detalhes:</p>
      
      <div class="info-box">
        <div class="info-item">
          <span class="info-label">Exame:</span>
          <span class="info-value">${examName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Especialidade:</span>
          <span class="info-value">${examSpecialty}</span>
        </div>
      </div>
      
      <div class="date-highlight">
        📅 ${formattedDate}
      </div>
      
      ${
        notes
          ? `
      <div class="notes">
        <strong>Observações:</strong><br>
        ${notes}
      </div>
      `
          : ''
      }
      
      <p style="margin-top: 30px; font-size: 14px; color: #666;">
        <strong>Importante:</strong> Por favor, chegue com 15 minutos de antecedência. 
        Em caso de necessidade de cancelamento ou remarcação, entre em contato conosco com pelo menos 24 horas de antecedência.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Aspect Hospital</strong></p>
      <p>📍 Endereço: Rua Exemplo, 123 - São Paulo, SP</p>
      <p>📞 Telefone: (11) 1234-5678</p>
      <p>📧 Email: contato@aspect.com</p>
    </div>
  </div>
</body>
</html>
  `;

  // Email para o paciente
  const patientMailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: patientEmail,
    subject: `Confirmação de Agendamento - ${examName}`,
    html: htmlContent,
  };

  // Email de notificação para o administrador
  const adminHtmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Agendamento</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
    }
    .content {
      padding: 30px;
    }
    .info-box {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .info-item {
      margin: 12px 0;
      font-size: 16px;
    }
    .info-label {
      font-weight: 600;
      color: #1565c0;
      display: inline-block;
      min-width: 140px;
    }
    .info-value {
      color: #333;
    }
    .alert {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
      border-radius: 8px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 50px; margin-bottom: 10px;">📋</div>
      <h1>Novo Agendamento</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Notificação Administrativa</p>
    </div>
    
    <div class="content">
      <p style="font-size: 18px; color: #1565c0; margin-bottom: 20px;">
        <strong>Um novo agendamento foi realizado!</strong>
      </p>
      
      <div class="info-box">
        <div class="info-item">
          <span class="info-label">Paciente:</span>
          <span class="info-value">${patientName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">${patientEmail}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Exame:</span>
          <span class="info-value">${examName}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Especialidade:</span>
          <span class="info-value">${examSpecialty}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Data e Hora:</span>
          <span class="info-value">${formattedDate}</span>
        </div>
        ${
          notes
            ? `
        <div class="info-item">
          <span class="info-label">Observações:</span>
          <span class="info-value">${notes}</span>
        </div>
        `
            : ''
        }
      </div>
      
      <div class="alert">
        ⚠️ <strong>Atenção:</strong> O paciente já recebeu um email de confirmação com os detalhes do agendamento.
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const adminMailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: process.env.SMTP_USER,
    subject: `🔔 Novo Agendamento - ${patientName} - ${examName}`,
    html: adminHtmlContent,
  };

  try {
    // Enviar email para o paciente
    await transporter.sendMail(patientMailOptions);
    console.log(`✅ Email de confirmação enviado para ${patientEmail}`);
    
    // Enviar notificação para o administrador
    await transporter.sendMail(adminMailOptions);
    console.log(`✅ Notificação de agendamento enviada para administrador`);
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    // Não lançar erro para não interromper o fluxo de criação do agendamento
  }
};
