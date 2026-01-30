const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

/* ======================
   AUTH
====================== */

// ✅ DEFINE authHeader FIRST
export const authHeader = () => ({
  Authorization: "Bearer " + localStorage.getItem("access"),
});

export async function login(username, password) {
  const res = await fetch(`${API}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) throw data;

  // ✅ Store JWT + role
  localStorage.setItem("access", data.access);
  if (data.refresh) {
    localStorage.setItem("refresh", data.refresh);
  }
  localStorage.setItem("role", data.role);

  return data;
}

/* ======================
   DASHBOARD
====================== */

export const getDashboard = async () => {
  const res = await fetch(`${API}/student/dashboard/`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export const resumeCourse = async (courseId) => {
  const res = await fetch(
    `${API}/student/course/${courseId}/resume/`,
    {
      headers: authHeader(),
    }
  );
  return res.json();
};

/* ======================
   COURSES & LESSONS
====================== */

export const getCourses = async () => {
  const res = await fetch(`${API}/courses/`, {
    headers: authHeader(),
  });
  return res.json();
};

export const getCourseLessons = async (courseId) => {
  const res = await fetch(`${API}/courses/${courseId}/lessons/`, {
    headers: authHeader(),
  });
  return res.json();
};

export const getLesson = async (lessonId) => {
  const res = await fetch(`${API}/student/lesson/${lessonId}/`, {
    headers: authHeader(),
  });
  return res.json();
};

/* ======================
   QUIZ
====================== */

export const getQuiz = async (quizId) => {
  const res = await fetch(`${API}/quiz/${quizId}/`, {
    headers: authHeader(),
  });
  if (!res.ok) throw new Error("Failed to load quiz");
  return res.json();
};

export const submitQuiz = async (quizId, answers) => {
  const res = await fetch(`${API}/student/quiz/${quizId}/submit/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ answers }),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};