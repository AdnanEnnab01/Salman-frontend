import React, { useState } from 'react';
import './Patients.css';

const Patients = () => {
  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sample patient data with payment history
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Ahmed Ali',
      phone: '0791234567',
      totalAmount: 500,
      paidAmount: 300,
      remainingAmount: 200,
      hasRemainingPayment: true,
      paymentHistory: [
        { id: 1, amount: 150, date: new Date('2024-01-10T10:30:00'), notes: 'Initial payment' },
        { id: 2, amount: 150, date: new Date('2024-01-15T14:20:00'), notes: 'Second payment' }
      ]
    },
    {
      id: 2,
      name: 'Sara Mohammad',
      phone: '0789876543',
      totalAmount: 800,
      paidAmount: 800,
      remainingAmount: 0,
      hasRemainingPayment: false,
      paymentHistory: [
        { id: 1, amount: 400, date: new Date('2024-01-05T09:15:00'), notes: 'First installment' },
        { id: 2, amount: 400, date: new Date('2024-01-20T11:45:00'), notes: 'Final payment' }
      ]
    },
    {
      id: 3,
      name: 'Omar Hassan',
      phone: '0775551234',
      totalAmount: 1200,
      paidAmount: 500,
      remainingAmount: 700,
      hasRemainingPayment: true,
      paymentHistory: [
        { id: 1, amount: 500, date: new Date('2024-01-08T13:00:00'), notes: 'Down payment' }
      ]
    },
    {
      id: 4,
      name: 'Fatima Ibrahim',
      phone: '0798889999',
      totalAmount: 600,
      paidAmount: 600,
      remainingAmount: 0,
      hasRemainingPayment: false,
      paymentHistory: [
        { id: 1, amount: 600, date: new Date('2024-01-12T10:00:00'), notes: 'Full payment' }
      ]
    },
    {
      id: 5,
      name: 'Khalid Mahmoud',
      phone: '0771112222',
      totalAmount: 1000,
      paidAmount: 400,
      remainingAmount: 600,
      hasRemainingPayment: true,
      paymentHistory: [
        { id: 1, amount: 200, date: new Date('2024-01-03T15:30:00'), notes: 'Initial deposit' },
        { id: 2, amount: 200, date: new Date('2024-01-18T16:00:00'), notes: '' }
      ]
    },
    {
      id: 6,
      name: 'Layla Ahmad',
      phone: '0783334444',
      totalAmount: 450,
      paidAmount: 450,
      remainingAmount: 0,
      hasRemainingPayment: false,
      paymentHistory: [
        { id: 1, amount: 450, date: new Date('2024-01-14T12:00:00'), notes: 'Complete payment' }
      ]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    notes: ''
  });
  const [patientFormData, setPatientFormData] = useState({
    name: '',
    phone: '',
    totalAmount: ''
  });

  // Calculate statistics
  const totalPatients = patients.length;
  const patientsWithRemainingPayments = patients.filter(
    patient => patient.hasRemainingPayment
  ).length;
  const remainingPaymentsPercentage = totalPatients > 0
    ? Math.round((patientsWithRemainingPayments / totalPatients) * 100)
    : 0;

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient => {
    const query = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    );
  });

  // Handle patient details view
  const handleViewDetails = (patient) => {
    // Ensure patient has paymentHistory array
    const patientWithHistory = {
      ...patient,
      paymentHistory: patient.paymentHistory || []
    };
    setSelectedPatient(patientWithHistory);
    setShowDetailsModal(true);
  };

  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedPatient(null);
  };

  // Handle add payment
  const handleAddPayment = (patient) => {
    setSelectedPatient(patient);
    setShowAddPaymentModal(true);
    setPaymentFormData({ amount: '', notes: '' });
  };

  const handleCloseAddPayment = () => {
    setShowAddPaymentModal(false);
    setSelectedPatient(null);
    setPaymentFormData({ amount: '', notes: '' });
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData({
      ...paymentFormData,
      [name]: value
    });
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    if (!paymentFormData.amount || parseFloat(paymentFormData.amount) <= 0) {
      return;
    }

    const paymentAmount = parseFloat(paymentFormData.amount);
    const updatedPatients = patients.map(patient => {
      if (patient.id === selectedPatient.id) {
        const newPaidAmount = patient.paidAmount + paymentAmount;
        const newRemainingAmount = Math.max(0, patient.totalAmount - newPaidAmount);
        const newPaymentHistory = [
          {
            id: patient.paymentHistory.length > 0 
              ? Math.max(...patient.paymentHistory.map(p => p.id)) + 1 
              : 1,
            amount: paymentAmount,
            date: new Date(),
            notes: paymentFormData.notes || ''
          },
          ...patient.paymentHistory
        ];

        return {
          ...patient,
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          hasRemainingPayment: newRemainingAmount > 0,
          paymentHistory: newPaymentHistory
        };
      }
      return patient;
    });

    setPatients(updatedPatients);
    const updatedPatient = updatedPatients.find(p => p.id === selectedPatient.id);
    setSelectedPatient(updatedPatient);
    handleCloseAddPayment();
  };

  // Handle add patient
  const handleAddPatient = () => {
    setShowAddPatientModal(true);
    setPatientFormData({ name: '', phone: '', totalAmount: '' });
  };

  const handleCloseAddPatient = () => {
    setShowAddPatientModal(false);
    setPatientFormData({ name: '', phone: '', totalAmount: '' });
  };

  const handlePatientInputChange = (e) => {
    const { name, value } = e.target;
    setPatientFormData({
      ...patientFormData,
      [name]: value
    });
  };

  const handleSubmitPatient = (e) => {
    e.preventDefault();
    if (!patientFormData.name || !patientFormData.phone || !patientFormData.totalAmount) {
      return;
    }

    const totalAmount = parseFloat(patientFormData.totalAmount);
    const newPatient = {
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
      name: patientFormData.name.trim(),
      phone: patientFormData.phone.trim(),
      totalAmount: totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      hasRemainingPayment: totalAmount > 0,
      paymentHistory: []
    };

    setPatients([...patients, newPatient]);
    handleCloseAddPatient();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ILS'
    }).format(amount);
  };

  return (
    <div className="patients-container">
      {/* Statistics Section */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-icon total">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Patient
          </button>
        </div>
      </div>

      {/* Patients Table */}
      <div className="table-container">
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
                    ? "No patients found matching your search" 
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
                    <span className={patient.hasRemainingPayment ? 'remaining-amount' : 'paid-amount'}>
                      {formatCurrency(patient.remainingAmount)}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${patient.hasRemainingPayment ? 'pending' : 'paid'}`}>
                      {patient.hasRemainingPayment ? 'Pending Payment' : 'Fully Paid'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="details-btn"
                        onClick={() => handleViewDetails(patient)}
                        title="View Details"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Details
                      </button>
                      <button 
                        className="add-payment-btn"
                        onClick={() => handleAddPayment(patient)}
                        title="Add Payment"
                        disabled={!patient.hasRemainingPayment}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      </div>

      {/* Patient Details Modal */}
      {showDetailsModal && selectedPatient && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Patient Details</h3>
              <button className="close-btn" onClick={handleCloseDetails}>×</button>
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
                <span className="detail-value">{formatCurrency(selectedPatient.totalAmount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Paid Amount:</span>
                <span className="detail-value paid-amount">{formatCurrency(selectedPatient.paidAmount)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Remaining Amount:</span>
                <span className={`detail-value ${selectedPatient.hasRemainingPayment ? 'remaining-amount' : 'paid-amount'}`}>
                  {formatCurrency(selectedPatient.remainingAmount)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status:</span>
                <span className={`status-badge ${selectedPatient.hasRemainingPayment ? 'pending' : 'paid'}`}>
                  {selectedPatient.hasRemainingPayment ? 'Pending Payment' : 'Fully Paid'}
                </span>
              </div>
            </div>

            {/* Payment History Section */}
            <div className="payment-history-section">
              <h4 className="payment-history-title">Payment History</h4>
              {selectedPatient.paymentHistory && selectedPatient.paymentHistory.length > 0 ? (
                <div className="payment-history-list">
                  {selectedPatient.paymentHistory.map((payment) => (
                    <div key={payment.id} className="payment-history-item">
                      <div className="payment-history-header">
                        <span className="payment-amount">{formatCurrency(payment.amount)}</span>
                        <span className="payment-date">{formatDate(payment.date)}</span>
                      </div>
                      {payment.notes && (
                        <div className="payment-notes">
                          <span className="payment-notes-label">Notes:</span>
                          <span className="payment-notes-text">{payment.notes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-payment-history">No payment history available</p>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="add-payment-modal-btn" 
                onClick={() => {
                  setShowDetailsModal(false);
                  handleAddPayment(selectedPatient);
                }}
                disabled={!selectedPatient.hasRemainingPayment}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Payment
              </button>
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
          <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Payment - {selectedPatient.name}</h3>
              <button className="close-btn" onClick={handleCloseAddPayment}>×</button>
            </div>
            <form onSubmit={handleSubmitPayment} className="payment-form">
              <div className="form-group">
                <label htmlFor="amount">Payment Amount *</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">ILS</span>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={paymentFormData.amount}
                    onChange={handlePaymentInputChange}
                    placeholder="0.00"
                    min="0.01"
                    max={selectedPatient.remainingAmount}
                    step="0.01"
                    required
                    className="amount-input"
                  />
                </div>
                <p className="remaining-amount-hint">
                  Remaining: {formatCurrency(selectedPatient.remainingAmount)}
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={paymentFormData.notes}
                  onChange={handlePaymentInputChange}
                  placeholder="Add any notes about this payment..."
                  rows="4"
                  className="notes-textarea"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseAddPayment}>
                  Cancel
                </button>
                <button type="submit" className="submit-payment-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
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
          <div className="modal-content patient-form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Patient</h3>
              <button className="close-btn" onClick={handleCloseAddPatient}>×</button>
            </div>
            <form onSubmit={handleSubmitPatient} className="patient-form">
              <div className="form-group">
                <label htmlFor="patientName">Patient Name *</label>
                <input
                  type="text"
                  id="patientName"
                  name="name"
                  value={patientFormData.name}
                  onChange={handlePatientInputChange}
                  placeholder="Enter patient name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="patientPhone">Phone Number *</label>
                <input
                  type="tel"
                  id="patientPhone"
                  name="phone"
                  value={patientFormData.phone}
                  onChange={handlePatientInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="patientTotalAmount">Total Amount (ILS) *</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">ILS</span>
                  <input
                    type="number"
                    id="patientTotalAmount"
                    name="totalAmount"
                    value={patientFormData.totalAmount}
                    onChange={handlePatientInputChange}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    required
                    className="amount-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleCloseAddPatient}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
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