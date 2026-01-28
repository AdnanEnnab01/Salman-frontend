import React, { useState, useEffect } from "react";
import "./Appointments.css";

const Appointments = () => {
  // --- Date Helpers (Kept from your original) ---
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [formData, setFormData] = useState({
    patientName: "",
    phoneNumber: "",
    appointmentDate: getTodayDate(),
    appointmentTime: "",
  });

  const today = getTodayDate();

  // --- Backend Integration ---

  // 1. Fetch Appointments from Backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/appointments");
      if (response.ok) {
        const data = await response.json();
        // Transform backend keys to match your frontend keys
        const formattedData = data.map((apt) => ({
          id: apt.id,
          patientName: apt.patient_name,
          phoneNumber: apt.phone,
          appointmentDate: apt.appointment_date,
          appointmentTime: apt.appointment_time,
          status: apt.status.toLowerCase(),
          procedure: apt.procedure,
        }));
        setAppointments(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // 2. Add New Appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      patient_name: formData.patientName,
      phone: formData.phoneNumber,
      appointment_date: formData.appointmentDate,
      appointment_time: formData.appointmentTime,
      procedure: "General Checkup", // Default or add a field to your form
    };

    try {
      const response = await fetch("http://localhost:8000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchAppointments(); // Refresh list
        handleCancel(); // Reset form
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  // 3. Confirm (Update Status)
  const handleConfirmAppointment = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/appointments/${id}?status=Completed`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 4. Cancel (Delete)
  const handleCancelAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/appointments/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) fetchAppointments();
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  // --- Logic for Statistics & Filtering (Kept from your original) ---
  const selectedDateAllAppointments = appointments.filter(
    (apt) => apt.appointmentDate === selectedDate
  );

  const selectedDateRemainingAppointments = selectedDateAllAppointments.filter(
    (apt) => apt.status === "upcoming" || apt.status === "scheduled"
  );

  const totalAppointmentsCount = selectedDateAllAppointments.length;
  const remainingAppointmentsCount = selectedDateRemainingAppointments.length;
  const completedAppointmentsCount = selectedDateAllAppointments.filter(
    (apt) => apt.status === "completed"
  ).length;

  const completedAppointmentsPercentage =
    totalAppointmentsCount > 0
      ? Math.round((completedAppointmentsCount / totalAppointmentsCount) * 100)
      : 0;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setFormData({
      patientName: "",
      phoneNumber: "",
      appointmentDate: getTodayDate(),
      appointmentTime: "",
    });
  };

  if (loading && appointments.length === 0)
    return (
      <div className="appointments-container">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="appointments-container">
      {/* Date Selector Section */}
      <div className="date-selector-section">
        <div className="date-selector-card">
          <label htmlFor="datePicker" className="date-label">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
        <div className="stat-card completed-stat">
          <div className="stat-icon completed">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Completion Rate</h3>
            <p className="stat-number">{completedAppointmentsPercentage}%</p>
            <p className="stat-detail">
              {completedAppointmentsCount} of {totalAppointmentsCount}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon today">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Appointments</h3>
            <p className="stat-number">{totalAppointmentsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon upcoming">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Remaining</h3>
            <p className="stat-number">{remainingAppointmentsCount}</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="appointments-header">
        <div>
          <h2>Appointments</h2>
          <p className="date-subtitle">
            Showing: <strong>{formatDate(selectedDate)}</strong>
          </p>
        </div>
        <button
          className="add-appointment-btn"
          onClick={() => setShowAddForm(true)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Appointment
        </button>
      </div>

      {/* Modal Form */}
      {showAddForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Appointment</h3>
              <button className="close-btn" onClick={handleCancel}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
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

      {/* Table */}
      <div className="table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Phone</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedDateAllAppointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No appointments found.
                </td>
              </tr>
            ) : (
              selectedDateAllAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.phoneNumber}</td>
                  <td>{appointment.appointmentTime}</td>
                  <td>
                    <span className={`status-badge ${appointment.status}`}>
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {appointment.status !== "completed" && (
                        <button
                          className="confirm-btn"
                          onClick={() =>
                            handleConfirmAppointment(appointment.id)
                          }
                        >
                          Confirm
                        </button>
                      )}
                      <button
                        className="cancel-btn-action"
                        onClick={() => handleCancelAppointment(appointment.id)}
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
