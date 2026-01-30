import { useEffect, useState } from "react";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    fetch(`${API}/teacher/quizzes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load quizzes", err);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading quizzes...</p>;

  return (
    <div className="container">
      <h2>📘 Quizzes</h2>

      {quizzes.length === 0 ? (
        <p>No quizzes found</p>
      ) : (
        quizzes.map((quiz) => (
          <div key={quiz.id} className="card">
            <h4>{quiz.title}</h4>
            <p>Lesson: {quiz.lesson_title}</p>
            <p>Total Questions: {quiz.question_count}</p>
          </div>
        ))
      )}
    </div>
  );
}