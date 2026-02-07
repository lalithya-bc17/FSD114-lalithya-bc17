import { useParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import "./TeacherLessonQuiz.css";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherLessonQuiz() {
  const { lessonId } = useParams();
  const token = localStorage.getItem("access");

  const [quizId, setQuizId] = useState(null);
  const [quizTitle, setQuizTitle] = useState("");   // ✅ TITLE STATE
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [question, setQuestion] = useState({
    text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct: "A",
  });

  // ================= LOAD QUIZ =================
  const loadExistingQuiz = useCallback(async () => {
    try {
      const res = await fetch(
        `${API}/teacher/lesson/${lessonId}/quiz/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) return;

      const data = await res.json();
      setQuizId(data.id);
      setQuizTitle(data.title); // ✅ LOAD TITLE
    } catch {
      // silent
    }
  }, [lessonId, token]);

  useEffect(() => {
    loadExistingQuiz();
  }, [loadExistingQuiz]);

  // ================= FETCH QUESTIONS =================
  const fetchQuestions = useCallback(async () => {
    if (!quizId) return;

    try {
      const res = await fetch(
        `${API}/teacher/quiz/${quizId}/questions/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuestions(data);
    } catch {
      toast.error("Failed to load questions");
    }
  }, [quizId, token]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // ================= CREATE QUIZ =================
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
        await loadExistingQuiz();
        return;
      }

      setQuizId(data.id);
      setQuizTitle(data.title);
      toast.success("Quiz created");
    } catch {
      toast.error("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE QUIZ TITLE =================
  const updateQuizTitle = async () => {
    try {
      const res = await fetch(
        `${API}/teacher/quiz/${quizId}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: quizTitle }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Quiz title updated");
    } catch {
      toast.error("Failed to update quiz title");
    }
  };

  // ================= ADD / UPDATE QUESTION =================
  const submitQuestion = async () => {
    const url = editingId
      ? `${API}/teacher/question/${editingId}/update/`
      : `${API}/teacher/quiz/${quizId}/question/`;

    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(question),
      });

      if (!res.ok) throw new Error();

      toast.success(editingId ? "Question updated" : "Question added");
      resetForm();
      fetchQuestions();
    } catch {
      toast.error("Failed to save question");
    }
  };

  // ================= DELETE QUESTION =================
  const deleteQuestion = async (id) => {
    try {
      const res = await fetch(
        `${API}/teacher/question/${id}/delete/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Question deleted");
      fetchQuestions();
    } catch (err) {
        const msg =
        err?.response?.data?.detail ||
        "Cannot delete. Quiz already attempted by students.";

        toast.error(msg);
      }
  };

  const resetForm = () => {
    setEditingId(null);
    setQuestion({
      text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct: "A",
    });
  };

  return (
    <div className="quiz-container">
      <h2>📝 Lesson Quiz</h2>

      {!quizId && (
        <button onClick={createQuiz} disabled={loading} className="btn-primary">
          + Create Quiz
        </button>
      )}

      {quizId && (
        <>
          {/* ===== QUIZ TITLE EDIT ===== */}
          <div className="quiz-meta">
            <h3>Quiz Title</h3>
            <input
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Quiz title"
            />
            <button className="btn-primary" onClick={updateQuizTitle}>
              Save Title
            </button>
          </div>

          {/* ===== ADD / EDIT QUESTION FORM ===== */}
          <div className="question-form">
            <h3>{editingId ? "Edit Question" : "Add Question"}</h3>

            <input
              placeholder="Question"
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
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
            </select>

            <button className="btn-success" onClick={submitQuestion}>
              {editingId ? "Update Question" : "Add Question"}
            </button>

            {editingId && (
              <button className="btn-danger" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>

          {/* ===== QUESTION LIST ===== */}
          <div className="question-list">
            <h3>Added Questions</h3>

            {questions.map((q, i) => (
              <div key={q.id} className="question-card">
                <p>
                  <strong>{i + 1}. {q.text}</strong>
                </p>
                <ul>
                  <li>A. {q.option_a}</li>
                  <li>B. {q.option_b}</li>
                  <li>C. {q.option_c}</li>
                  <li>D. {q.option_d}</li>
                </ul>
                <p><strong>Correct:</strong> {q.correct}</p>

                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEditingId(q.id);
                    setQuestion(q);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn-danger"
                  onClick={() => deleteQuestion(q.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}