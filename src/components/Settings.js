import React, { useEffect, useState } from "react";
import "./Settings.css";

const Settings = () => {
  const STORAGE_KEY = "clinic_settings_v1";

  const [clinicInfo, setClinicInfo] = useState({
    clinicName: "",
    specialties: "",
    doctorEducation: "",
  });

  const [workingHours, setWorkingHours] = useState([
    { day: "Sunday", enabled: true, from: "09:00", to: "17:00" },
    { day: "Monday", enabled: true, from: "09:00", to: "17:00" },
    { day: "Tuesday", enabled: true, from: "09:00", to: "17:00" },
    { day: "Wednesday", enabled: true, from: "09:00", to: "17:00" },
    { day: "Thursday", enabled: true, from: "09:00", to: "17:00" },
    { day: "Friday", enabled: false, from: "09:00", to: "13:00" },
    { day: "Saturday", enabled: false, from: "09:00", to: "13:00" },
  ]);

  const [chatbotEnabled, setChatbotEnabled] = useState(true);
  const [clinicOpen, setClinicOpen] = useState(true);

  const [editingField, setEditingField] = useState(null); // "clinicName" | "specialties" | "doctorEducation" | null

  // Load saved settings (if any) from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.clinicInfo) setClinicInfo(parsed.clinicInfo);
        if (parsed.workingHours) setWorkingHours(parsed.workingHours);
        if (typeof parsed.chatbotEnabled === "boolean") {
          setChatbotEnabled(parsed.chatbotEnabled);
        }
        if (typeof parsed.clinicOpen === "boolean") {
          setClinicOpen(parsed.clinicOpen);
        }
      }
    } catch (error) {
      console.error("Failed to load clinic settings:", error);
    }
  }, []);

  const handleClinicInfoChange = (field, value) => {
    setClinicInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWorkingHourChange = (index, field, value) => {
    setWorkingHours((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, [field]: value } : slot
      )
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      clinicInfo,
      workingHours,
      chatbotEnabled,
      clinicOpen,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      console.log("Settings saved:", payload);
      alert("Settings saved successfully.");
      setEditingField(null);
    } catch (error) {
      console.error("Failed to save clinic settings:", error);
      alert("Failed to save settings. Please try again.");
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h2>Clinic Settings</h2>
          <p>
            Customize your clinic profile, chatbot behavior, and weekly working
            hours.
          </p>
        </div>
        <button className="primary-save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <div className="settings-grid">
        {/* Left column: general clinic info */}
        <section className="settings-card">
          <h3>General Information</h3>
          <p className="card-subtitle">
            Basic information that will be shown to patients and used by the
            chatbot.
          </p>

          {/* Clinic Name */}
          <div className="form-group">
            <div className="field-header">
              <label>Clinic Name</label>
              <button
                type="button"
                className="edit-icon-button"
                onClick={() => setEditingField("clinicName")}
              >
                <span className="edit-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </span>
                <span className="edit-text">Edit</span>
              </button>
            </div>

            {editingField === "clinicName" ? (
              <input
                type="text"
                placeholder="e.g. Bright Smile Dental Clinic"
                value={clinicInfo.clinicName}
                onChange={(e) =>
                  handleClinicInfoChange("clinicName", e.target.value)
                }
              />
            ) : (
              <div className="readonly-field">
                {clinicInfo.clinicName || "No clinic name saved yet."}
              </div>
            )}
          </div>

          {/* Doctor Specialties */}
          <div className="form-group">
            <div className="field-header">
              <label>Doctor Specialties</label>
              <button
                type="button"
                className="edit-icon-button"
                onClick={() => setEditingField("specialties")}
              >
                <span className="edit-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </span>
                <span className="edit-text">Edit</span>
              </button>
            </div>

            {editingField === "specialties" ? (
              <textarea
                rows="3"
                placeholder="e.g. General Dentistry, Orthodontics, Cosmetic Dentistry"
                value={clinicInfo.specialties}
                onChange={(e) =>
                  handleClinicInfoChange("specialties", e.target.value)
                }
              />
            ) : (
              <div className="readonly-field multiline">
                {clinicInfo.specialties || "No specialties saved yet."}
              </div>
            )}
            <span className="field-hint">
              List the main specialties or services you provide.
            </span>
          </div>

          {/* Doctor Education & Background */}
          <div className="form-group">
            <div className="field-header">
              <label>Doctor Education & Background</label>
              <button
                type="button"
                className="edit-icon-button"
                onClick={() => setEditingField("doctorEducation")}
              >
                <span className="edit-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </span>
                <span className="edit-text">Edit</span>
              </button>
            </div>

            {editingField === "doctorEducation" ? (
              <textarea
                rows="4"
                placeholder="e.g. DDS, MSc in Orthodontics. 10+ years of experience in treating adults and children."
                value={clinicInfo.doctorEducation}
                onChange={(e) =>
                  handleClinicInfoChange("doctorEducation", e.target.value)
                }
              />
            ) : (
              <div className="readonly-field multiline">
                {clinicInfo.doctorEducation ||
                  "No education or background information saved yet."}
              </div>
            )}
            <span className="field-hint">
              Short description about the doctor&apos;s studies, degrees, and
              experience.
            </span>
          </div>
        </section>

        {/* Right column: toggles */}
        <section className="settings-card">
          <h3>Availability & Status</h3>
          <p className="card-subtitle">
            Control whether the chatbot and the clinic are active.
          </p>

          <div className="toggle-row">
            <div>
              <p className="toggle-title">Chatbot Status</p>
              <p className="toggle-description">
                Turn the chatbot on or off for patients.
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={chatbotEnabled}
                onChange={(e) => setChatbotEnabled(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="toggle-row">
            <div>
              <p className="toggle-title">Clinic Status</p>
              <p className="toggle-description">
                Close the clinic temporarily (appointments and chatbot).
              </p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={clinicOpen}
                onChange={(e) => setClinicOpen(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>

          <div className="status-summary">
            <span
              className={`status-pill ${chatbotEnabled ? "online" : "offline"}`}
            >
              Chatbot: {chatbotEnabled ? "Enabled" : "Disabled"}
            </span>
            <span
              className={`status-pill ${clinicOpen ? "online" : "offline"}`}
            >
              Clinic: {clinicOpen ? "Open" : "Closed"}
            </span>
          </div>
        </section>
      </div>

      {/* Working hours */}
      <section className="settings-card full-width">
        <div className="card-header-row">
          <div>
            <h3>Weekly Working Hours</h3>
            <p className="card-subtitle">
              Define on which days the clinic is open and at what times.
            </p>
          </div>
        </div>

        <div className="working-hours-list">
          {workingHours.map((slot, index) => (
            <div key={slot.day} className="working-hour-row">
              <div className="day-info">
                <label className="day-name">{slot.day}</label>
                <label className="day-toggle">
                  <input
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={(e) =>
                      handleWorkingHourChange(
                        index,
                        "enabled",
                        e.target.checked
                      )
                    }
                  />
                  <span>Open</span>
                </label>
              </div>

              <div className="time-range">
                <div className="time-field">
                  <span>From</span>
                  <input
                    type="time"
                    value={slot.from}
                    onChange={(e) =>
                      handleWorkingHourChange(index, "from", e.target.value)
                    }
                    disabled={!slot.enabled}
                  />
                </div>
                <div className="time-field">
                  <span>To</span>
                  <input
                    type="time"
                    value={slot.to}
                    onChange={(e) =>
                      handleWorkingHourChange(index, "to", e.target.value)
                    }
                    disabled={!slot.enabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Settings;

