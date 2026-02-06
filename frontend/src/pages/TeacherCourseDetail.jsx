import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Load lessons
  const loadLessons = useCallback(async () => {
    const res = await fetch(
      `${API}/courses/${courseId}/lessons/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setLessons(data.courses || []);
  }, [courseId, token]);

  useEffect(() => {
    loadLessons();
  }, [loadLessons]);

  // ➕ CREATE LESSON (TITLE ONLY)
  const createLesson = async () => {
    if (!title.trim()) {
      toast.error("Lesson title required");
      return;
    }

    setLoading(true);

    const res = await fetch(
      `${API}/teacher/course/${courseId}/add-lesson/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }), // ✅ TITLE ONLY
      }
    );

    setLoading(false);

    if (res.ok) {
      toast.success("Lesson created ✅");
      setTitle("");
      loadLessons();
    } else {
      toast.error("Permission denied ❌");
    }
  };

  return (
    <div className="container">
      <h2>Manage Course</h2>

      {/* CREATE LESSON */}
      <div className="card">
        <input
          placeholder="Lesson title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={createLesson} disabled={loading}>
          {loading ? "Saving..." : "Create Lesson"}
        </button>
      </div>

      <hr />

      {/* LESSON LIST */}
      <h3>Lessons</h3>

      {lessons.length === 0 && <p>No lessons yet</p>}

      {lessons.map((l) => (
        <div key={l.id} className="card">
          <strong>
            {l.order}. {l.title}
          </strong>

          <button onClick={() => navigate(`/teacher/lesson/${l.id}`)}>
            Edit Lesson
          </button>
          

          <p>Status: {l.status}</p>
        </div>
      ))}
    </div>
  );
}