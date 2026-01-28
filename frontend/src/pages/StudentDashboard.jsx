import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, resumeCourse } from "../api";
import "../styles.css";

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
        alert("Unable to download certificate.");
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
      alert("Certificate download failed.");
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
        alert("Session expired. Please login again.");

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
      alert("🎉 You have completed all lessons in this course!");
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
        alert("No lesson to resume.");
      }
    } catch (e) {
      console.error("Resume failed", e);
      alert("Failed to resume course");
    }
  };

  /* ==========================
     🎨 UI
  ========================== */
  return (
    <div className="dashboard">
      <h2>My Learning</h2>

      {courses.map((course) => {
        const percent = course.progress;
        const isCompleted = course.completed === course.total;

        return (
          <div key={course.course_id} className="course-card">
            <h3>{course.course}</h3>

            <div className="progress">
              <div className="progress-bar" style={{ width: percent + "%" }}>
                {percent}%
              </div>
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
                  alert("🎉 You have completed all lessons in this course!")
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