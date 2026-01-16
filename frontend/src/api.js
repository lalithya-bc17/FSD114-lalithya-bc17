const API = "http://127.0.0.1:8000/api";

// LOGIN
export async function login(username, password) {
  const res = await fetch(`${API}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export const authHeader = () => ({
  Authorization: "Bearer " + localStorage.getItem("token"),
});

// DASHBOARD
export const getDashboard = async () => {
  const res = await fetch(`${API}/student/dashboard/`, { headers: authHeader() });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export const resumeCourse = async (courseId) => {
  const res = await fetch(`${API}/student/course/${courseId}/resume/`, { headers: authHeader() });
  return res.json();
};

// COURSES & LESSONS
export const getCourses = async () => {
  const res = await fetch(`${API}/courses/`, { headers: authHeader() });
  return res.json();
};

export const getCourseLessons = async (courseId) => {
  const res = await fetch(`${API}/courses/${courseId}/lessons/`, {
    headers: authHeader()
  });

  

  return res.json();   // <-- directly return array
};

// LESSON
export const getLesson = async (lessonId) => {
  const res = await fetch(`${API}/student/lesson/${lessonId}/`, { headers: authHeader() });
  return res.json();
};

// QUIZ
export const submitQuiz = async (quizId, answers) => {
  const res = await fetch(`${API}/student/quiz/${quizId}/submit/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();   // always read JSON

  if (!res.ok) {
    throw data;   // throw backend error properly
  }

  return data;
};
// GET QUIZ
export const getQuiz = async (quizId) => {
  const res = await fetch(`http://127.0.0.1:8000/quiz/${quizId}/`, {
    headers: authHeader()
  });

  if (!res.ok) throw new Error("Failed to load quiz");
  return res.json();
};