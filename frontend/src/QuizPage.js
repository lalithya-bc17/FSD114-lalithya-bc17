import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz } from "./api";

export default function QuizPage() {
  const { id } = useParams(); // quiz id
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Load quiz
  useEffect(() => {
    getQuiz(id)
      .then((data) => setQuiz(data))
      .catch(() => alert("Failed to load quiz"));
  }, [id]);

  const selectAnswer = (questionId, optionKey) => {
    setAnswers({ ...answers, [questionId]: optionKey });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length === 0) {
      alert("❌ Please select at least one answer before submitting");
      return;
    }

    try {
      const res = await submitQuiz(id, answers);
      setResult(res);

      if (res.passed) {
        alert("🎉 Quiz passed!");
      } else {
        alert("❌ Some answers are wrong. Try again.");
      }
    } catch {
      alert("Quiz submit failed");
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  // Lock quiz if already passed
  if (quiz.locked) {
    return <h2>✅ Quiz already passed</h2>;
  }

  return (
    <div className="container">
      <h2>{quiz.title}</h2>

      {quiz.questions.map((q) => (
        <div
          key={q.id}
          className="card"
          style={{ padding: "10px", margin: "10px 0" }}
        >
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
        <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
          Submit Quiz
        </button>
      )}

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>Score: {result.score}%</h3>
          <p>{result.passed ? "✅ Passed" : "❌ Failed"}</p>

          {/* ✅ Resume Next Lesson */}
          {result.passed && result.next_lesson_id && (
            <button
              onClick={() =>
                navigate(`/lesson/${result.next_lesson_id}`)
              }
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ▶ Resume Next Lesson
            </button>
          )}

          {/* 🎓 Certificate / Dashboard Redirect */}
          {result.passed && !result.next_lesson_id && (
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
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