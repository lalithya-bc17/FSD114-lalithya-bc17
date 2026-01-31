import React, { useEffect, useState } from "react";
import "../styles.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("https://certificate-verification-backend-7gpb.onrender.com/api/admin/stats/", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => console.error("Failed to load admin stats"));
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Welcome, Admin 🛠️</h2>
      <p className="subtitle">System overview & administration</p>

      {/* 🔢 ADMIN STATS */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">👤 Users: {stats.total_users}</div>
          <div className="stat-card">🎓 Students: {stats.total_students}</div>
          <div className="stat-card">📚 Courses: {stats.total_courses}</div>
          <div className="stat-card">📝 Enrollments: {stats.total_enrollments}</div>
          <div className="stat-card">📜 Certificates: {stats.total_certificates}</div>
        </div>
      )}

      {/* MAIN ACTION CARDS */}
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