import React, { useState } from 'react';
import './BusinessHoursCalendar.css';

interface BusinessHoursCalendarProps {
  selectedDate: string;
  onChange: (date: string) => void;
}

const BusinessHoursCalendar: React.FC<BusinessHoursCalendarProps> = ({ selectedDate, onChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const businessHours = Array.from({ length: 10 }, (_, i) => i + 9); // 9h às 18h

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isWeekday = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day >= 1 && day <= 5; // Monday to Friday
  };

  const isPastDate = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isAvailable = (date: Date | null): boolean => {
    if (!date) return false;
    return isWeekday(date) && !isPastDate(date) && !isTodayPastBusinessHours(date);
  };

  const handleDayClick = (date: Date | null) => {
    if (!isAvailable(date)) return;
    setSelectedDay(date);
  };

  const handleTimeClick = (hour: number) => {
    if (!selectedDay) return;
    
    // Create date in local timezone
    const selectedDate = new Date(selectedDay);
    selectedDate.setHours(hour, 0, 0, 0);
    
    // Format as YYYY-MM-DDTHH:mm (local time, no timezone conversion)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const hourStr = String(hour).padStart(2, '0');
    const formatted = `${year}-${month}-${day}T${hourStr}:00`;
    
    onChange(formatted);
  };

  const isTimeAvailable = (hour: number): boolean => {
    if (!selectedDay) return false;
    
    const now = new Date();
    const selectedDate = new Date(selectedDay);
    selectedDate.setHours(hour, 0, 0, 0);
    
    // Check if selected day is today
    const isToday = now.toDateString() === selectedDay.toDateString();
    
    if (isToday) {
      // For today, time must be at least 1 hour from now
      const minTime = new Date();
      minTime.setHours(minTime.getHours() + 1, 0, 0, 0);
      return selectedDate >= minTime;
    }
    
    return true;
  };

  const isTodayPastBusinessHours = (date: Date): boolean => {
    const now = new Date();
    const isToday = now.toDateString() === date.toDateString();
    
    if (isToday) {
      const currentHour = now.getHours();
      // If current time is 17h or later, no more business hours available today
      return currentHour >= 17;
    }
    
    return false;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    setSelectedDay(null);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="business-calendar">
      <div className="calendar-section">
        <div className="calendar-header">
          <button onClick={previousMonth} className="nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3>
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={nextMonth} className="nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="calendar-grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {days.map((date, index) => {
            const available = isAvailable(date);
            const isSelected = selectedDay && date && 
              selectedDay.getTime() === date.getTime();
            
            return (
              <div
                key={index}
                className={`calendar-day ${!date ? 'empty' : ''} ${
                  available ? 'available' : 'unavailable'
                } ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDayClick(date)}
              >
                {date ? date.getDate() : ''}
              </div>
            );
          })}
        </div>

        {selectedDay && (
          <div className="selected-date-info">
            <i className="fas fa-calendar-check"></i>
            <span>
              {selectedDay.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        )}
      </div>

      {selectedDay && (
        <div className="time-section">
          <h4>
            <i className="fas fa-clock"></i>
            Horários Disponíveis
          </h4>
          <div className="time-grid">
            {businessHours.map((hour) => {
              const timeStr = `${hour.toString().padStart(2, '0')}:00`;
              const available = isTimeAvailable(hour);
              const isCurrentTime = selectedDate && 
                new Date(selectedDate).getHours() === hour &&
                new Date(selectedDate).toDateString() === selectedDay.toDateString();
              
              return (
                <button
                  key={hour}
                  className={`time-slot ${isCurrentTime ? 'selected-time' : ''} ${!available ? 'disabled' : ''}`}
                  onClick={() => handleTimeClick(hour)}
                  disabled={!available}
                >
                  <i className="fas fa-clock"></i>
                  {timeStr}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {!selectedDay && (
        <div className="time-section placeholder">
          <i className="fas fa-info-circle"></i>
          <p>Selecione um dia útil para ver os horários disponíveis</p>
        </div>
      )}
    </div>
  );
};

export default BusinessHoursCalendar;
