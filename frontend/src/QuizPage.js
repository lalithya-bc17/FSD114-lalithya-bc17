import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz } from "./api";

export default function QuizPage() {
  const { id } = useParams();   // quiz id
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    getQuiz(id)
      .then(setQuiz)
      .catch(() => alert("Failed to load quiz"));
  }, [id]);

  const selectAnswer = (questionId, optionId) => {
    setAnswers({ ...answers, [questionId]: optionId });
  };

  const submit = async () => {
    try {
      const data = await submitQuiz(id, answers);
      setResult(data);

      if (data.passed) {
        alert("🎉 Quiz passed! Next lesson unlocked!");
        navigate(-1);   // go back to lesson list
      }
    } catch {
      alert("Quiz submit failed");
    }
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div className="container">
      <h2>{quiz.title}</h2>

      {quiz.questions.map(q => (
        <div key={q.id} className="card">
          <h4>{q.question}</h4>

          {q.options.map(o => (
            <label key={o.id} style={{ display: "block" }}>
              <input
                type="radio"
                name={q.id}
                checked={answers[q.id] === o.id}
                onChange={() => selectAnswer(q.id, o.id)}
              />
              {o.text}
            </label>
          ))}
        </div>
      ))}

      <button onClick={submit}>Submit Quiz</button>

      {result && (
        <div className="card">
          <p>Score: {result.score}%</p>
          <p>{result.passed ? "✅ Passed" : "❌ Failed"}</p>
        </div>
      )}
    </div>
  );
}