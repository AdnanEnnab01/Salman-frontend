import React, { useState, useEffect } from "react";
import "./Patients.css";

const Patients = () => {
  const API_URL = "http://localhost:8000/api"; // Ensure this matches your FastAPI port

  // State Management
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    notes: "",
  });
  const [patientFormData, setPatientFormData] = useState({
    name: "",
    phone: "",
    totalAmount: "",
  });

  // --- API Calls ---

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/patients`);
      if (!response.ok) throw new Error("Failed to fetch patients");
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate statistics
  const totalPatients = patients.length;
  const patientsWithRemainingPayments = patients.filter(
    (p) => p.hasRemainingPayment
  ).length;
  const remainingPaymentsPercentage =
    totalPatients > 0
      ? Math.round((patientsWithRemainingPayments / totalPatients) * 100)
      : 0;

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  });

  // --- Handlers ---

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPatient(null);
  };

  const handleAddPayment = (patient) => {
    setSelectedPatient(patient);
    setShowAddPaymentModal(true);
    setPaymentFormData({ amount: "", notes: "" });
  };

  const handleCloseAddPayment = () => {
    setShowAddPaymentModal(false);
    setPaymentFormData({ amount: "", notes: "" });
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!paymentFormData.amount || parseFloat(paymentFormData.amount) <= 0)
      return;

    try {
      const response = await fetch(
        `${API_URL}/patients/${selectedPatient.id}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(paymentFormData.amount),
            notes: paymentFormData.notes,
          }),
        }
      );

      if (response.ok) {
        await fetchPatients(); // Refresh list
        handleCloseAddPayment();
      }
    } catch (error) {
      console.error("Error adding payment:", error);
    }
  };

  const handleAddPatient = () => {
    setShowAddPatientModal(true);
    setPatientFormData({ name: "", phone: "", totalAmount: "" });
  };

  const handleCloseAddPatient = () => {
    setShowAddPatientModal(false);
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: patientFormData.name,
          phone: patientFormData.phone,
          totalAmount: parseFloat(patientFormData.totalAmount),
        }),
      });

      if (response.ok) {
        await fetchPatients();
        handleCloseAddPatient();
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ILS",
    }).format(amount);
  };

  return (
    <div className="patients-container">
      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon total">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Registered Patients</h3>
            <p className="stat-number">{totalPatients}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Patients with Remaining Payments</h3>
            <p className="stat-number">{patientsWithRemainingPayments}</p>
          </div>
        </div>

        <div className="stat-card percentage-stat">
          <div className="stat-icon percentage">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div className="stat-info">
            <h3>Percentage with Remaining Payments</h3>
            <p className="stat-number">{remainingPaymentsPercentage}%</p>
            <p className="stat-detail">
              {patientsWithRemainingPayments} of {totalPatients}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Header Section */}
      <div className="patients-header">
        <div>
          <h2>Patients</h2>
          <p className="patients-subtitle">
            Manage patient information and payments
          </p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <svg
              className="search-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Search for a patient (name, phone number)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="add-patient-btn" onClick={handleAddPatient}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Patient
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="table-container">
        {loading ? (
          <div className="no-data">Loading patients...</div>
        ) : (
          <table className="patients-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Total Amount</th>
                <th>Paid Amount</th>
                <th>Remaining Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    {searchQuery
                      ? "No patients found"
                      : "No patients registered"}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.name}</td>
                    <td>{patient.phone}</td>
                    <td>{formatCurrency(patient.totalAmount)}</td>
                    <td>{formatCurrency(patient.paidAmount)}</td>
                    <td>
                      <span
                        className={
                          patient.hasRemainingPayment
                            ? "remaining-amount"
                            : "paid-amount"
                        }
                      >
                        {formatCurrency(patient.remainingAmount)}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${
                          patient.hasRemainingPayment ? "pending" : "paid"
                        }`}
                      >
                        {patient.hasRemainingPayment
                          ? "Pending Payment"
                          : "Fully Paid"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="details-btn"
                          onClick={() => handleViewDetails(patient)}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          Details
                        </button>
                        <button
                          className="add-payment-btn"
                          onClick={() => handleAddPayment(patient)}
                          disabled={!patient.hasRemainingPayment}
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
                          Add Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Patient Details</h3>
              <button className="close-btn" onClick={handleCloseDetails}>
                ×
              </button>
            </div>
            <div className="patient-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{selectedPatient.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone Number:</span>
                <span className="detail-value">{selectedPatient.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Total Amount:</span>
                <span className="detail-value">
                  {formatCurrency(selectedPatient.totalAmount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Paid Amount:</span>
                <span className="detail-value paid-amount">
                  {formatCurrency(selectedPatient.paidAmount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Remaining Amount:</span>
                <span
                  className={`detail-value ${
                    selectedPatient.hasRemainingPayment
                      ? "remaining-amount"
                      : "paid-amount"
                  }`}
                >
                  {formatCurrency(selectedPatient.remainingAmount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span
                  className={`status-badge ${
                    selectedPatient.hasRemainingPayment ? "pending" : "paid"
                  }`}
                >
                  {selectedPatient.hasRemainingPayment ? "Pending" : "Paid"}
                </span>
              </div>
            </div>

            <div className="payment-history-section">
              <h4 className="payment-history-title">Payment History</h4>
              {selectedPatient.paymentHistory?.length > 0 ? (
                <div className="payment-history-list">
                  {selectedPatient.paymentHistory.map((payment) => (
                    <div key={payment.id} className="payment-history-item">
                      <div className="payment-history-header">
                        <span className="payment-amount">
                          {formatCurrency(payment.amount)}
                        </span>
                        <span className="payment-date">
                          {formatDate(payment.created_at || payment.date)}
                        </span>
                      </div>
                      {payment.notes && (
                        <div className="payment-notes">
                          <span className="payment-notes-text">
                            {payment.notes}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-payment-history">No history</p>
              )}
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={handleCloseDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {showAddPaymentModal && selectedPatient && (
        <div className="modal-overlay" onClick={handleCloseAddPayment}>
          <div
            className="modal-content payment-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Add Payment - {selectedPatient.name}</h3>
              <button className="close-btn" onClick={handleCloseAddPayment}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitPayment} className="payment-form">
              <div className="form-group">
                <label>Amount (ILS)</label>
                <input
                  type="number"
                  value={paymentFormData.amount}
                  onChange={(e) =>
                    setPaymentFormData({
                      ...paymentFormData,
                      amount: e.target.value,
                    })
                  }
                  max={selectedPatient.remainingAmount}
                  required
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={paymentFormData.notes}
                  onChange={(e) =>
                    setPaymentFormData({
                      ...paymentFormData,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseAddPayment}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-payment-btn">
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddPatientModal && (
        <div className="modal-overlay" onClick={handleCloseAddPatient}>
          <div
            className="modal-content patient-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3>Add New Patient</h3>
              <button className="close-btn" onClick={handleCloseAddPatient}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitPatient} className="patient-form">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  value={patientFormData.name}
                  onChange={(e) =>
                    setPatientFormData({
                      ...patientFormData,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={patientFormData.phone}
                  onChange={(e) =>
                    setPatientFormData({
                      ...patientFormData,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Amount (ILS) *</label>
                <input
                  type="number"
                  value={patientFormData.totalAmount}
                  onChange={(e) =>
                    setPatientFormData({
                      ...patientFormData,
                      totalAmount: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCloseAddPatient}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
