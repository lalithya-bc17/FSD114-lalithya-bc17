import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz } from "../api";
import "../styles.css";
import { toast } from "react-toastify";

export default function QuizPage() {
  const { id } = useParams(); // quiz id
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // ✅ ref to control reset timer (VERY IMPORTANT)
  const resetTimerRef = useRef(null);

  // 🔄 Reset quiz ONLY for wrong answer
  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  // ✅ Load quiz
  useEffect(() => {
    getQuiz(id)
      .then((data) => setQuiz(data))
      .catch(() => toast.error("Failed to load quiz"));
  }, [id]);

  // Select answer
  const selectAnswer = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      toast.error("❌ Please select at least one answer before submitting");
      return;
    }

    try {
      const res = await submitQuiz(id, answers);
      setResult(res);

      if (res.passed) {
        toast.success("🎉 Quiz passed!");

        // ❌ cancel any pending reset
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
          resetTimerRef.current = null;
        }

      } else {
        toast.error("❌ Some answers are wrong. Try again.");

        // ✅ auto reset ONLY for failure
        resetTimerRef.current = setTimeout(() => {
          resetQuiz();
        }, 1500);
      }

    } catch (err) {
      toast.error("Quiz submit failed");
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  // ✅ If quiz already passed
  if (quiz.passed) {
    return (
      <div className="container">
        <h2>✅ Quiz already passed</h2>
        <button onClick={() => navigate("/student/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>{quiz.title}</h2>

      {quiz.questions.map((q) => (
        <div key={q.id} className="card">
          <h4>{q.text}</h4>

          {["a", "b", "c", "d"].map((key) => {
            let bg = "";

            if (result?.details) {
              const r = result.details.find(
                (d) => d.question_id === q.id
              );
              if (r) {
                if (key.toUpperCase() === r.correct) bg = "#c8f7c5";
                else if (key.toUpperCase() === r.selected) bg = "#f7c5c5";
              }
            }

            return (
              <label
                key={key}
                style={{
                  display: "block",
                  background: bg,
                  padding: "5px",
                  margin: "5px 0",
                }}
              >
                <input
                  type="radio"
                  name={q.id}
                  disabled={!!result}
                  checked={answers[q.id] === key.toUpperCase()}
                  onChange={() =>
                    selectAnswer(q.id, key.toUpperCase())
                  }
                />
                {q[key]}
              </label>
            );
          })}
        </div>
      ))}

      {!result && (
        <button onClick={handleSubmit} style={{ marginTop: 20 }}>
          Submit Quiz
        </button>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Score: {result.score}%</h3>
          <p>{result.passed ? "✅ Passed" : "❌ Failed"}</p>

          {/* ▶ Resume next lesson */}
          {result.passed && result.next_lesson_id && (
            <button
              onClick={() =>
                navigate(`/lesson/${result.next_lesson_id}`)
              }
              className="lesson-open"
            >
              ▶ Resume Next Lesson
            </button>
          )}

          {/* 🎓 Course completed */}
          {result.passed && !result.next_lesson_id && (
            <button
              onClick={() => navigate("/student/dashboard")}
              className="certificate-btn"
            >
              🎓 Go to Dashboard / Download Certificate
            </button>
          )}
        </div>
      )}
    </div>
  );
}