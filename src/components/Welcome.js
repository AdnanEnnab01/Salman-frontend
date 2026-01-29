import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Appointments from "./Appointments";
import Patients from "./Patients";
import Settings from "./Settings";
import "./Welcome.css";

const Welcome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("appointments");

  useEffect(() => {
    // 1. Check for stored session from login
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");

    if (!accessToken || !userData) {
      // If no token or user data, kick back to login page
      navigate("/");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    // 2. Clear local storage to end session
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Don't render until user state is initialized
  if (!user) {
    return null;
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
            className={`nav-tab ${
              activeTab === "appointments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            <svg
              className="nav-icon"
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
            <span>Appointments</span>
          </button>

          <button
            className={`nav-tab ${activeTab === "patients" ? "active" : ""}`}
            onClick={() => setActiveTab("patients")}
          >
            <svg
              className="nav-icon"
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
            <span>Patients</span>
          </button>

          <button
            className={`nav-tab ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <svg
              className="nav-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 3.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 9a1.65 1.65 0 0 0 1.51 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button-sidebar">
            <svg
              className="logout-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
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
          {/* Display Dr Mohammad or the user's email if name isn't in metadata */}
          <h1>
            Welcome{" "}
            {user.email === "mohammad@example.com"
              ? "Dr Mohammad"
              : user.email.split("@")[0]}
          </h1>
        </div>

        <div className="content-body">
          {activeTab === "appointments" && <Appointments />}
          {activeTab === "patients" && <Patients />}
          {activeTab === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
};

export default Welcome;
