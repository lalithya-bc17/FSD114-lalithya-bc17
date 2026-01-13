import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, resumeCourse } from "./api";
import "./styles.css";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboard();
        setCourses(data || []);
      } catch (e) {
        console.error("Dashboard load failed", e);
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    load();
  }, [navigate]);

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

            <button
              onClick={() => handleView(course)}
              className={isCompleted ? "lesson-completed" : "lesson-open"}
            >
              {isCompleted ? "Completed" : "View Lessons"}
            </button>

            <button onClick={() => handleResume(course)} disabled={isCompleted}>
              {isCompleted ? "Completed" : "Resume"}
            </button>

            {/* 🎓 CERTIFICATE BUTTON */}
            {isCompleted && (
              <a
                href={`http://127.0.0.1:8000/api/certificate/${course.course_id}/`}
                target="_blank"
                rel="noreferrer"
              >
                <button className="certificate-btn">
                  🎓 Download Certificate
                </button>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}