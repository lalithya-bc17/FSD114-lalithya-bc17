import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";
import TeacherCourseCompletion from "./TeacherCourseCompletion";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const token = localStorage.getItem("access");

  const [analytics, setAnalytics] = useState(null);

  // ================= LOAD ANALYTICS =================
  useEffect(() => {
    fetch(`${API}/teacher/analytics/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAnalytics(data))
      .catch(() => console.error("Failed to load analytics"));
  }, [token]);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {name} 👋</h2>
      <p className="subtitle">
        Manage your courses, students, and assessments
      </p>

      {/* ================= ANALYTICS CARDS ================= */}
      {!analytics ? (
        <p>Loading analytics...</p>
      ) : (
        <div className="analytics-grid">
          <div className="card analytics-card">
            <h4>Courses Created</h4>
            <b>{analytics.courses_created}</b>
          </div>

          <div className="card analytics-card">
            <h4>Total Students</h4>
            <b>{analytics.total_students}</b>
          </div>

          <div className="card analytics-card">
            <h4>Certificates Issued</h4>
            <b>{analytics.certificates_issued}</b>
          </div>

          <div className="card analytics-card">
            <h4>Completion Rate</h4>
            <b>{analytics.completion_rate}%</b>
          </div>
        </div>
      )}
      {/* ================= COURSE-WISE COMPLETION TABLE ================= */}
      <TeacherCourseCompletion />

      {/* ================= ACTION CARDS ================= */}
      <div className="card-grid">
        <div className="card">
          <h3>My Courses</h3>
          <p>View & manage your courses</p>
          <button onClick={() => navigate("/teacher/courses")}>
            View Courses
          </button>
        </div>

        <div className="card">
          <h3>Add Lessons</h3>
          <p>Create lessons for your courses</p>
          <button onClick={() => navigate("/teacher/courses")}>
            Add Lesson
          </button>
        </div>

        <div className="card">
          <h3>Quizzes</h3>
          <p>Create & review quizzes</p>
          <button onClick={() => navigate("/teacher/quizzes")}>
            Manage Quizzes
          </button>
        </div>

        <div className="card">
          <h3>Students</h3>
          <p>View enrolled students</p>
          <button onClick={() => navigate("/teacher/students")}>
            View Students
          </button>
        </div>
        <div className="card">
  <h3>Certificates</h3>
  <p>View & manage student certificates</p>
  <button onClick={() => navigate("/teacher/certificates")}>
    View Certificates
  </button>
</div>
      </div>

      {/* INFO */}
      <div className="info-box">
        <p>ℹ️ Analytics are calculated only from your own courses.</p>
      </div>
    </div>
  );
}