import React, { useState } from 'react';
import './Appointments.css';

const Appointments = () => {
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get tomorrow's date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [appointments, setAppointments] = useState(() => {
    const today = getTodayDate();
    const tomorrow = getTomorrowDate();
    
    return [
      {
        id: 1,
        patientName: 'Ahmed Ali',
        phoneNumber: '0791234567',
        appointmentDate: today,
        appointmentTime: '10:00 AM',
        status: 'upcoming'
      },
      {
        id: 2,
        patientName: 'Sara Mohammad',
        phoneNumber: '0789876543',
        appointmentDate: today,
        appointmentTime: '11:30 AM',
        status: 'upcoming'
      },
      {
        id: 3,
        patientName: 'Omar Hassan',
        phoneNumber: '0775551234',
        appointmentDate: tomorrow,
        appointmentTime: '09:00 AM',
        status: 'upcoming'
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    appointmentDate: '',
    appointmentTime: ''
  });

  // Calculate statistics based on selected date
  const today = getTodayDate();
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Total minutes since midnight
  
  // Helper function to convert time string to minutes
  const timeToMinutes = (timeStr) => {
    // Handle formats like "10:00 AM", "11:30 AM", "2:00 PM"
    const isPM = timeStr.toUpperCase().includes('PM');
    const timeMatch = timeStr.match(/(\d+):(\d+)/);
    if (!timeMatch) return 0;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    
    if (isPM && hours !== 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };
  
  // Appointments for selected date (for table)
  const selectedDateAllAppointments = appointments.filter(
    (apt) => apt.appointmentDate === selectedDate
  );

  // Stats for selected date
  const selectedDateRemainingAppointments = selectedDateAllAppointments.filter(
    (apt) => apt.status === 'upcoming'
  );

  const totalAppointmentsCount = selectedDateAllAppointments.length;
  const remainingAppointmentsCount = selectedDateRemainingAppointments.length;
  const completedAppointmentsCount = Math.max(
    0,
    totalAppointmentsCount - remainingAppointmentsCount
  );
  const completedAppointmentsPercentage =
    totalAppointmentsCount > 0
      ? Math.round((completedAppointmentsCount / totalAppointmentsCount) * 100)
      : 0;

  // Use remaining appointments for the table (same day)
  const selectedDateAppointments = selectedDateRemainingAppointments;

  // Handle appointment actions
  const handleConfirmAppointment = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'completed' } : apt
    ));
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.patientName && formData.phoneNumber && formData.appointmentDate && formData.appointmentTime) {
      const newAppointment = {
        id: appointments.length + 1,
        ...formData,
        status: 'upcoming'
      };
      setAppointments([...appointments, newAppointment]);
      setFormData({
        patientName: '',
        phoneNumber: '',
        appointmentDate: '',
        appointmentTime: ''
      });
      setShowAddForm(false);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({
      patientName: '',
      phoneNumber: '',
      appointmentDate: '',
      appointmentTime: ''
    });
  };

  return (
    <div className="appointments-container">
      {/* Date Selector Section */}
      <div className="date-selector-section">
        <div className="date-selector-card">
          <label htmlFor="datePicker" className="date-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Select Date
          </label>
          <input
            type="date"
            id="datePicker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />
          {selectedDate && (
            <div className="selected-date-info">
              <p className="date-display">{formatDate(selectedDate)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        {totalAppointmentsCount > 0 && (
          <div className="stat-card completed-stat">
            <div className="stat-icon completed">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="stat-info">
              <h3>
                {selectedDate === today
                  ? "Today's Completion Rate"
                  : "Selected Date Completion Rate"}
              </h3>
              <p className="stat-number">{completedAppointmentsPercentage}%</p>
              <p className="stat-detail">
                {completedAppointmentsCount} of {totalAppointmentsCount}
              </p>
            </div>
          </div>
        )}

        <div className="stat-card">
          <div className="stat-icon today">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{selectedDate === today ? "Today's Total Appointments" : "Selected Date Total Appointments"}</h3>
            <p className="stat-number">{totalAppointmentsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon upcoming">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{selectedDate === today ? "Today's Remaining Appointments" : "Selected Date Remaining Appointments"}</h3>
            <p className="stat-number">{remainingAppointmentsCount}</p>
          </div>
        </div>
      </div>

      {/* Header with Add Button */}
      <div className="appointments-header">
        <div>
          <h2>Appointments</h2>
          <p className="date-subtitle">
            Showing appointments for: <strong>{formatDate(selectedDate)}</strong>
          </p>
        </div>
        <button className="add-appointment-btn" onClick={() => setShowAddForm(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Appointment
        </button>
      </div>

      {/* Add Appointment Form Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Appointment</h3>
              <button className="close-btn" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label htmlFor="patientName">Patient Name</label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointmentDate">Appointment Date</label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="appointmentTime">Appointment Time</label>
                <input
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointments Table */}
      <div className="table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedDateAppointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  {selectedDate === today 
                    ? "No upcoming appointments for today" 
                    : `No appointments found for ${formatDate(selectedDate)}`}
                </td>
              </tr>
            ) : (
              selectedDateAppointments
                .sort((a, b) => {
                  // Sort by time
                  const timeA = a.appointmentTime.replace(/[^\d]/g, '');
                  const timeB = b.appointmentTime.replace(/[^\d]/g, '');
                  return timeA.localeCompare(timeB);
                })
                .map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.phoneNumber}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="confirm-btn"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                          title="Confirm Appointment"
                        >
                          Confirm
                        </button>
                        <button 
                          className="cancel-btn-action"
                          onClick={() => handleCancelAppointment(appointment.id)}
                          title="Cancel Appointment"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
