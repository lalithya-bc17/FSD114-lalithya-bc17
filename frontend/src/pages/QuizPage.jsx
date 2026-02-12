import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz } from "../api";
import "../styles.css";
import { toast } from "react-toastify";

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const resetTimerRef = useRef(null);

  const resetQuiz = () => {
    setAnswers({});
    setResult(null);
  };

  useEffect(() => {
    getQuiz(id)
      .then((data) => setQuiz(data))
      .catch(() => toast.error("Failed to load quiz"));
  }, [id]);

  const selectAnswer = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

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
        if (resetTimerRef.current) {
          clearTimeout(resetTimerRef.current);
          resetTimerRef.current = null;
        }
      } else {
        toast.error("❌ Some answers are wrong. Try again.");
        resetTimerRef.current = setTimeout(() => {
          resetQuiz();
        }, 1500);
      }
    } catch {
      toast.error("Quiz submit failed");
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  if (quiz.passed) {
    return (
      <div
        style={{
          maxWidth: "600px",
          margin: "50px auto",
          textAlign: "center"
        }}
      >
        <h2>✅ Quiz already passed</h2>
        <button onClick={() => navigate("/student/dashboard")}>
          ⬅ Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "650px",
        margin: "50px auto",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
      }}
    >
      <h2 style={{ marginBottom: "30px" }}>{quiz.title}</h2>

      {quiz.questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "30px" }}>
          <h4 style={{ marginBottom: "15px" }}>{q.text}</h4>

          {["a", "b", "c", "d"].map((key) => {
            let bg = "";

            if (result?.details) {
              const r = result.details.find(
                (d) => d.question_id === q.id
              );
              if (r) {
                if (key.toUpperCase() === r.correct) bg = "#d1fae5";
                else if (key.toUpperCase() === r.selected) bg = "#fee2e2";
              }
            }

            return (
              <label
                key={key}
                style={{
                  display: "block",
                  background: bg,
                  padding: "10px",
                  margin: "8px 0",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  cursor: "pointer"
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
                  style={{ marginRight: "8px" }}
                />
                {q[key]}
              </label>
            );
          })}
        </div>
      ))}

      {!result && (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            background: "#0d9488",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Submit Quiz
        </button>
      )}

      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>Score: {result.score}%</h3>
          <p>{result.passed ? "✅ Passed" : "❌ Failed"}</p>

          {result.passed && result.next_lesson_id && (
            <button
              onClick={() =>
                navigate(`/lesson/${result.next_lesson_id}`)
              }
              style={{
                marginTop: "15px",
                padding: "10px 18px",
                background: "#0d9488",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              ▶ Resume Next Lesson
            </button>
          )}

          {result.passed && !result.next_lesson_id && (
            <button
              onClick={() => navigate("/student/dashboard")}
              style={{
                marginTop: "15px",
                padding: "10px 18px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              🎓 Go to Dashboard / Download Certificate
            </button>
          )}
        </div>
      )}
    </div>
  );
}