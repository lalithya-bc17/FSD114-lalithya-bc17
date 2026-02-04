import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseLessons } from "../api";
import "../styles.css";
import { toast } from "react-toastify";

export default function CoursePage() {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const data = await getCourseLessons(courseId);
        setLessons(data.courses || []);
      } catch (err) {
        console.error("Lesson fetch error:", err);
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  if (loading) return <p>Loading lessons...</p>;
  if (!lessons.length) return <p>No lessons found for this course.</p>;

  const allCompleted =
    lessons.length > 0 &&
    lessons.every(l => l.status === "completed");

  if (allCompleted) {
    return (
      <div className="container">
        <h2>🎉 Course Completed</h2>
        <p>No lessons left to complete.</p>
        <button onClick={() => navigate("/student/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate(-1)}>⬅ Back</button>
      <h2>Lessons</h2>

      {lessons.map((lesson, index) => {
        const prevCompleted =
          index === 0 || lessons[index - 1].status === "completed";

        const canOpen = lesson.unlocked && prevCompleted;

        const handleClick = () => {
          if (!lesson.unlocked) {
            toast.error("This lesson is locked!");
            return;
          }
          if (!prevCompleted) {
            toast.error("Please complete the previous lesson first!");
            return;
          }

          // ✅ FIXED ROUTE
          navigate(`/lesson/${lesson.id}`);
        };

        return (
          <div key={lesson.id} className="card">
            <span>
              {lesson.order}. {lesson.title}{" "}
              {lesson.status === "completed" && "✅ Completed"}
            </span>

            <button
              onClick={handleClick}
              className={
                lesson.status === "completed"
                  ? "lesson-completed"
                  : canOpen
                  ? "lesson-open"
                  : "lesson-locked"
              }
            >
              {lesson.status === "completed"
                ? "Open Again"
                : canOpen
                ? "Open"
                : "Locked 🔒"}
            </button>
          </div>
        );
      })}
    </div>
  );
}