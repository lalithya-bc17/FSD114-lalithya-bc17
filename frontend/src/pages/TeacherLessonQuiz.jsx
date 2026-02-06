import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherLessonQuiz() {
  const { lessonId } = useParams();
  const token = localStorage.getItem("access");

  const [quizId, setQuizId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [question, setQuestion] = useState({
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct: "A",
  });

  // 🟢 CREATE QUIZ (safe)
  const createQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/teacher/lesson/${lessonId}/quiz/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: "Lesson Quiz" }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.info("Quiz already exists. Add questions below.");
        return;
      }

      setQuizId(data.id);
      toast.success("Quiz created successfully");
    } catch {
      toast.error("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 ADD QUESTION
  const addQuestion = async () => {
    if (!quizId) {
      toast.error("Create quiz first");
      return;
    }

    try {
      const res = await fetch(
        `${API}/teacher/quiz/${quizId}/question/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(question),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Question added");

      setQuestion({
        text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct: "A",
      });
    } catch {
      toast.error("Failed to add question");
    }
  };

  return (
    <div className="container" style={{ maxWidth: "700px" }}>
      <h2>📝 Lesson Quiz</h2>

      {!quizId && (
        <button
          onClick={createQuiz}
          disabled={loading}
          className="btn btn-primary"
        >
          + Create Quiz
        </button>
      )}

      {quizId && (
        <>
          <h3 style={{ marginTop: "20px" }}>Add Question</h3>

          <input
            placeholder="Question text"
            value={question.text}
            onChange={(e) =>
              setQuestion({ ...question, text: e.target.value })
            }
          />

          <input
            placeholder="Option A"
            value={question.option_a}
            onChange={(e) =>
              setQuestion({ ...question, option_a: e.target.value })
            }
          />

          <input
            placeholder="Option B"
            value={question.option_b}
            onChange={(e) =>
              setQuestion({ ...question, option_b: e.target.value })
            }
          />

          <input
            placeholder="Option C"
            value={question.option_c}
            onChange={(e) =>
              setQuestion({ ...question, option_c: e.target.value })
            }
          />

          <input
            placeholder="Option D"
            value={question.option_d}
            onChange={(e) =>
              setQuestion({ ...question, option_d: e.target.value })
            }
          />

          <select
            value={question.correct}
            onChange={(e) =>
              setQuestion({ ...question, correct: e.target.value })
            }
          >
            <option value="A">Correct: A</option>
            <option value="B">Correct: B</option>
            <option value="C">Correct: C</option>
            <option value="D">Correct: D</option>
          </select>

          <button onClick={addQuestion} className="btn btn-success">
            Add Question
          </button>
        </>
      )}
    </div>
  );
}