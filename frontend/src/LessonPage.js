import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLesson } from "./api";
import "./styles.css";

export default function LessonPage() {
  const { id } = useParams(); // lesson id
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [videoDone, setVideoDone] = useState(false); // ✅ track video finished
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLesson(id)
      .then((data) => {
        setLesson(data || {});
        setCompleted(false); // reset when new lesson loads
        setVideoDone(false);
        setAnswers({});
        setResult(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lesson fetch error:", err);
        setLesson({});
        setLoading(false);
      });
  }, [id]);

  // Select quiz answer
  const choose = (qid, opt) => {
    setAnswers({ ...answers, [qid]: opt });
  };

  // ✅ Mark lesson as completed when video ends
  const handleVideoEnd = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/api/student/lesson/${lesson.id}/complete/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setVideoDone(true); // mark video locally complete
      setCompleted(true); // unlock quiz
    } catch (err) {
      console.error("Failed to mark lesson completed:", err);
      alert("Could not mark lesson as completed. Try again.");
    }
  };

  if (loading) return <p>Loading lesson...</p>;
  if (!lesson || Object.keys(lesson).length === 0)
    return <p>Lesson not found</p>;

  return (
    <div className="container">
      {/* Back button */}
      <button className="back" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      {/* Lesson Title */}
      <h2>{lesson.title || "Untitled Lesson"}</h2>

      {/* Video */}
      {lesson.video && (
        <video
          width="100%"
          controls
          src={`http://127.0.0.1:8000${lesson.video}`}
          onEnded={handleVideoEnd} // unlock quiz after video ends
        />
      )}

      {/* Video Completed Check */}
      {videoDone && <p className="alert">✅ Video Completed</p>}

      {/* Lesson Content */}
      <p>{lesson.content || "No content available."}</p>

      {/* Quiz Header */}
      <h3>Quiz {completed ? "✅" : "🔒"}</h3>

      {/* Quiz Content */}
      {completed ? (
        lesson.questions && lesson.questions.length > 0 ? (
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
          <p className="alert">Click start Quiz</p>
        )
      ) : (
        <p className="alert">🔒 Watch the video to unlock the quiz.</p>
      )}

      {/* Start Quiz Button */}
      {lesson.quiz_id && (
        <button
          onClick={() => navigate(`/quiz/${lesson.quiz_id}`)}
          disabled={!completed}
        >
          {completed ? "Start Quiz" : "Watch video to unlock quiz"}
        </button>
      )}

      {/* Quiz Result */}
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