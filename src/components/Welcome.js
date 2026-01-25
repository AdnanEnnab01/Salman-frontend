import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Appointments from './Appointments';
import Patients from './Patients';
import './Welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');

  useEffect(() => {
    // Check if user is logged in
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (!accessToken || !userData) {
      // Redirect to login if not authenticated
      navigate('/');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) {
    return null; // Will redirect, so return nothing
  }

  return (
    <div className="welcome-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Dental Clinic</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-tab ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Appointments</span>
          </button>

          <button 
            className={`nav-tab ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveTab('patients')}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>Patients</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button-sidebar">
            <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>Welcome Dr Mohammad</h1>
        </div>
        
        <div className="content-body">
          {activeTab === 'appointments' && <Appointments />}

          {activeTab === 'patients' && <Patients />}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
