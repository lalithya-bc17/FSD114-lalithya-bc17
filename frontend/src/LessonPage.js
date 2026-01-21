import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles.css";

export default function LessonPage() {
  const { id } = useParams(); // lesson id
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [videoDone, setVideoDone] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH LESSON WITH JWT TOKEN
  useEffect(() => {
    setLoading(true);

    fetch(`http://127.0.0.1:8000/api/student/lesson/${id}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLesson(data);
        setCompleted(false);
        setVideoDone(false);
        setAnswers({});
        setResult(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lesson fetch error:", err);
        setLesson(null);
        setLoading(false);
      });
  }, [id]);

  // Select quiz answer
  const choose = (qid, opt) => {
    setAnswers({ ...answers, [qid]: opt });
  };

  // ✅ MARK LESSON COMPLETED AFTER VIDEO
  const handleVideoEnd = async () => {
    try {
      await fetch(
        `http://127.0.0.1:8000/api/student/lesson/${lesson.id}/complete/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setVideoDone(true);
      setCompleted(true);
    } catch (err) {
      console.error("Failed to mark lesson completed:", err);
      alert("Could not mark lesson completed");
    }
  };

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="container">
      {/* Back button */}
      <button className="back" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* Lesson Title */}
      <h2>{lesson.title}</h2>

      {/* ✅ CLOUDINARY VIDEO (FIXED) */}
      {lesson.video_url && (
        <video width="100%" controls onEnded={handleVideoEnd}>
          <source src={lesson.video_url} type="video/mp4" />
        </video>
      )}

      {/* Video Completed */}
      {videoDone && <p className="alert">✅ Video Completed</p>}

      {/* Lesson Content */}
      <p>{lesson.content}</p>

      {/* Quiz Header */}
      <h3>Quiz {completed ? "✅" : "🔒"}</h3>

      {/* Quiz Section */}
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
          <p>Start Quiz</p>
        )
      ) : (
        <p className="alert">🔒 Watch the video to unlock the quiz.</p>
      )}

      {/* Start Quiz */}
      {lesson.quiz_id && (
        <button
          onClick={() => navigate(`/quiz/${lesson.quiz_id}`)}
          disabled={!completed}
        >
          {completed ? "Start Quiz" : "Watch video to unlock quiz"}
        </button>
      )}

      {/* Result */}
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