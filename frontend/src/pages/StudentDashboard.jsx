
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, resumeCourse } from "../api";
import "../styles.css";
import { toast } from "react-toastify";

/* 🔗 API base URL (works locally + Render) */
const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  /* ==========================
     🎓 DOWNLOAD CERTIFICATE
  ========================== */
  const downloadCertificate = async (courseId, courseTitle) => {
    try {
      const token = localStorage.getItem("access");

      const response = await fetch(
        `${API}/certificate/${courseId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        toast.error("Unable to download certificate.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseTitle}_certificate.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      toast.error("Certificate download failed.");
    }
  };

  /* ==========================
     📊 LOAD DASHBOARD
  ========================== */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboard();
        setCourses(data || []);
      } catch (e) {
        console.error("Dashboard load failed", e);
        toast.error("Session expired. Please login again.");

        // ✅ clean logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("role");

        navigate("/login");
      }
    };

    load();
  }, [navigate]);

  /* ==========================
     ▶ VIEW / RESUME
  ========================== */
  const handleView = (course) => {
    if (course.completed === course.total) {
      toast.success("🎉 You have completed all lessons in this course!");
      return;
    }
    navigate(`/course/${course.course_id}`);
  };

  const handleResume = async (course) => {
    try {
      const data = await resumeCourse(course.course_id);
      if (data.lesson_id) {
        navigate(`/lesson/${data.lesson_id}`);
      } else {
        toast.error("No lesson to resume.");
      }
    } catch (e) {
      console.error("Resume failed", e);
      toast.error("Failed to resume course");
    }
  };

  /* ==========================
     🎨 UI
  ========================== */
  return (
  <div className="dashboard">
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
    <h2>My Learning</h2>

    {/* ✅ EMPTY STATE (ADD THIS BLOCK) */}
    {courses.length === 0 && (
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <h3>No courses enrolled yet 📘</h3>
        <p>Start learning by enrolling in a course</p>

        <button
          onClick={() => navigate("/courses")}
          style={{
            marginTop: "16px",
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#0d9488",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Browse Courses
        </button>
      </div>
    )}

    {/* ✅ EXISTING COURSE CARDS (KEEP AS IS) */}
    {courses.map((course) => {
      const percent = course.progress;
      const isCompleted = course.completed === course.total;

      return (
        <div key={course.course_id} className="course-card">
          <h3>{course.course}</h3>

          {/* Progress Percentage Text */}
<div style={{ marginBottom: "6px", fontWeight: "600" }}>
  {percent}%
</div>

{/* Progress Bar */}
<div
  style={{
    width: "100%",
    backgroundColor: "#e5e7eb",
    borderRadius: "10px",
    height: "10px",
    overflow: "hidden"
  }}
>
  <div
    style={{
      width: `${percent}%`,
      backgroundColor: "#16a34a",
      height: "100%",
      transition: "width 0.4s ease"
    }}
  />
</div>

          <p>
            {course.completed}/{course.total} lessons completed
          </p>

          {!isCompleted ? (
            <button
              onClick={() => handleView(course)}
              className="lesson-open"
            >
              View Lessons
            </button>
          ) : (
            <button
              className="lesson-completed blue-completed"
              onClick={() =>
                toast.success("🎉 You have completed all lessons in this course!")
              }
            >
              Completed
            </button>
          )}

          {!isCompleted && (
            <button onClick={() => handleResume(course)}>
              Resume
            </button>
          )}

          {isCompleted && (
            <button
              className="certificate-btn"
              onClick={() =>
                downloadCertificate(course.course_id, course.course)
              }
            >
              🎓 Download Certificate
            </button>
          )}
        </div>
      );
    })}
  </div>

);
}