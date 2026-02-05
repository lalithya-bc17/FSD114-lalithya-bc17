import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  return (
    <div className="dashboard-container">
      <h2>Welcome, {name} 👋</h2>
      <p className="subtitle">
        Manage your courses, lessons, and assessments
      </p>

      {/* STATS */}
      <div className="card-grid">
        <div className="card">
          <h3>My Courses</h3>
          <p>View & manage courses</p>
          <button onClick={() => navigate("/teacher/courses")}>
            View Courses
          </button>
        </div>

        <div className="card">
          <h3>Add Lesson</h3>
          <p>Select a course to add lessons</p>
          <button onClick={() => navigate("/teacher/courses")}>
            Go to Courses
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
      </div>

      {/* INFO */}
      <div className="info-box">
        <p>
          ⚠️ Course creation and grading are currently managed via the Admin
          Panel.
        </p>
        <p>
          This dashboard provides a simplified teaching interface.
        </p>
      </div>
    </div>
  );
}