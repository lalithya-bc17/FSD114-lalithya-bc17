import React from "react";
import "../styles.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <h2>Welcome, Admin 🛠️</h2>
      <p className="subtitle">
        System overview & administration
      </p>

      <div className="card-grid">
        {/* DJANGO ADMIN */}
        <div className="card">
          <h3>Django Admin</h3>
          <p>Full system control</p>
          <a
            href="https://certificate-verification-backend-7gpb.onrender.com/admin/"
            target="_blank"
            rel="noreferrer"
          >
            <button>Open Django Admin</button>
          </a>
        </div>

        {/* USERS */}
        <div className="card">
          <h3>Users</h3>
          <p>Students & Teachers</p>
          <button disabled>Managed in Admin</button>
        </div>

        {/* COURSES */}
        <div className="card">
          <h3>Courses</h3>
          <p>Create & manage courses</p>
          <button disabled>Managed in Admin</button>
        </div>

        {/* ENROLLMENTS */}
        <div className="card">
          <h3>Enrollments</h3>
          <p>Student course enrollments</p>
          <button disabled>Managed in Admin</button>
        </div>

        {/* CERTIFICATES */}
        <div className="card">
          <h3>Certificates</h3>
          <p>Verification & issue</p>
          <button disabled>Managed in Admin</button>
        </div>
      </div>

      <div className="info-box">
        <p>⚠️ All critical operations are handled via Django Admin.</p>
        <p>This dashboard is a quick-access control panel.</p>
      </div>
    </div>
  );
}