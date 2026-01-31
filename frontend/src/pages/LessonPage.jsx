import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles.css";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function LessonPage() {
  const { id } = useParams(); // lesson id
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  // ✅ FETCH LESSON
  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/student/lesson/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setLesson(data);
        setCompleted(false);
        setVideoDone(false);
        setAnswers({});
        setResult(null);
      } catch (err) {
        console.error("Lesson fetch error:", err);
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id, token]);

  // Select quiz answer (safe)
  const choose = (qid, opt) => {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  // ✅ VIDEO COMPLETED → unlock quiz
  // ✅ CORRECT — frontend-only unlock
   const handleVideoEnd = async () => {
  try {
    const res = await fetch(
      `${API}/student/lesson/${lesson.id}/complete/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) throw new Error("Failed");

    setVideoDone(true);
    setCompleted(true);
  } catch (err) {
    console.error(err);
    alert("Could not mark lesson completed");
  }
};

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="container">
      {/* ⬅ Back */}
      <button className="back" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* Title */}
      <h2>{lesson.title}</h2>

      {/* 🎥 Video */}
      {lesson.video_url && (
        <video width="100%" controls onEnded={handleVideoEnd}>
          <source src={lesson.video_url} type="video/mp4" />
        </video>
      )}

      {videoDone && <p className="alert">✅ Video Completed</p>}

      {/* Content */}
      <p>{lesson.content}</p>

      {/* Quiz */}
      <h3>Quiz {completed ? "✅" : "🔒"}</h3>

      {completed ? (
        lesson.questions?.length > 0 ? (
          lesson.questions.map((q) => (
            <div key={q.id} className="card">
              <p>{q.text}</p>

              {["A", "B", "C", "D"].map((opt) => (
                <label key={opt} style={{ display: "block" }}>
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === opt}
                    onChange={() => choose(q.id, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))
        ) : (
          <p>No quiz questions</p>
        )
      ) : (
        <p className="alert">🔒 Watch the video to unlock the quiz.</p>
      )}

      {/* Start Quiz Button */}
      {lesson.quiz_id && (
        <button
          disabled={!completed}
          onClick={() => navigate(`/quiz/${lesson.quiz_id}`)}
        >
          {completed ? "Start Quiz" : "Watch video to unlock quiz"}
        </button>
      )}

      {/* Result (future-safe) */}
      {result && (
        <div className="card">
          <h3>Result</h3>
          <p>Score: {result.score}%</p>
          <p>
            {result.passed
              ? "✅ Passed — Next lesson unlocked!"
              : "❌ Failed — Try again"}
          </p>
        </div>
      )}
    </div>
  );
}