import React, { useEffect, useState } from "react";
import "../styles.css";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

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
      <div style={{ marginBottom: "15px" }}>
  <button
    onClick={() => navigate("/")}
    style={{
      background: "none",
      border: "none",
      color: "#0f766e",
      fontWeight: "600",
      cursor: "pointer"
    }}
  >
    ← Back to Home
  </button>
</div>
      <h2>Welcome, Admin 🛠️</h2>
      <p className="subtitle">System overview & administration</p>

      {/* 🔢 ADMIN STATS */}
      {!stats && <p>Loading...</p>}

{stats && (
  <div className="stats-grid">
    <div className="stat-card">
      <span>👤 Users</span>
      <h2>{stats.total_users}</h2>
    </div>

    <div className="stat-card">
      <span>🎓 Students</span>
      <h2>{stats.total_students}</h2>
    </div>

    <div className="stat-card">
      <span>👩‍🏫 Teachers</span>
      <h2>{stats.total_teachers}</h2>
    </div>

    <div className="stat-card">
      <span>📚 Courses</span>
      <h2>{stats.total_courses}</h2>
    </div>

    <div className="stat-card">
      <span>📝 Enrollments</span>
      <h2>{stats.total_enrollments}</h2>
    </div>

    <div className="stat-card">
      <span>📜 Certificates</span>
      <h2>{stats.total_certificates}</h2>
    </div>

    <div className="stat-card">
      <span>📢 Announcements</span>
      <h2>{stats.total_announcements}</h2>
    </div>
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
    <button onClick={() => navigate("/admin/users")}>
      View Users
    </button>
  </div>

  {/* COURSES */}
  <div className="card">
    <h3>Courses</h3>
    <p>Create & manage courses</p>
    <button onClick={() => navigate("/admin/courses")}>
      View Courses
    </button>
  </div>

  {/* ENROLLMENTS */}
  <div className="card">
    <h3>Enrollments</h3>
    <p>Student course enrollments</p>
    <button onClick={() => navigate("/admin/enrollments")}>
      View Enrollments
    </button>
  </div>

  {/* CERTIFICATES */}
  <div className="card">
    <h3>Certificates</h3>
    <p>Verification & issue</p>
    <button onClick={() => navigate("/admin/certificates")}>
      View Certificates
    </button>
  </div>

</div>

      <div className="info-box">
        <p>⚠️ All critical operations are handled via Django Admin.</p>
        <p>This dashboard is a quick-access control panel.</p>
      </div>
    </div>
  );
}