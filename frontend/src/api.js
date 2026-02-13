const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

/* ======================
   AUTH HEADER
====================== */
export const authHeader = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ======================
   AUTH
====================== */
export async function login(username, password) {
  const res = await fetch(`${API}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("LOGIN ERROR:", data);
    throw data;
  }

  // store tokens
  localStorage.setItem("access", data.access);
  if (data.refresh) {
    localStorage.setItem("refresh", data.refresh);
  }
  if (data.role) {
    localStorage.setItem("role", data.role);
  }

  return data;
}

/* ======================
   DASHBOARD
====================== */
export const getDashboard = async () => {
  const role = localStorage.getItem("role");
if (!role) {
  throw new Error("Role not found. Please login again.");
}

const endpoint =
  role === "teacher"
    ? `${API}/teacher/dashboard/`
    : `${API}/student/dashboard/`;
  

  const res = await fetch(endpoint, {
    headers: authHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("DASHBOARD ERROR:", data);
    throw data;
  }

  return data;
};

export const resumeCourse = async (courseId) => {
  const res = await fetch(
    `${API}/student/course/${courseId}/resume/`,
    { headers: authHeader() }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("RESUME COURSE ERROR:", data);
    throw data;
  }

  return data;
};

/* ======================
   COURSES & LESSONS
====================== */
export const getCourses = async () => {
  const res = await fetch(`${API}/courses/`, {
    headers: authHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("COURSES ERROR:", data);
    throw data;
  }

  return data;
};

export const getCourseLessons = async (courseId) => {
  const res = await fetch(`${API}/courses/${courseId}/lessons/`, {
    headers: authHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("LESSONS ERROR:", data);
    throw data;
  }

  return data;
};

export const getLesson = async (lessonId) => {
  const res = await fetch(`${API}/student/lesson/${lessonId}/`, {
    headers: authHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("LESSON ERROR:", data);
    throw data;
  }

  return data;
};

/* ======================
   QUIZ
====================== */
export const getQuiz = async (quizId) => {
  const res = await fetch(`${API}/quiz/${quizId}/`, {
    headers: authHeader(),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("QUIZ ERROR:", data);
    throw data;
  }

  return data;
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

  if (!res.ok) {
    console.error("SUBMIT QUIZ ERROR:", data);
    throw data;
  }

  return data;
};

// ======================
// ENROLL COURSE
// ======================

export const enrollCourse = async (courseId) => {
  const res = await fetch(
    `https://certificate-verification-backend-7gpb.onrender.com/api/enroll/${courseId}/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("ENROLL ERROR:", data);
    throw data;
  }

  return data;
};
/* ======================
   TEACHER LESSON APIs
====================== */

export const getTeacherLesson = async (lessonId) => {
  const res = await fetch(
    `${API}/teacher/lesson/${lessonId}/`,
    {
      headers: authHeader(),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("GET TEACHER LESSON ERROR:", data);
    throw data;
  }

  return data;
};

export const updateTeacherLessonVideo = async (lessonId, videoUrl) => {
  const res = await fetch(
    `${API}/teacher/lesson/${lessonId}/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({ video_url: videoUrl }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("UPDATE TEACHER LESSON ERROR:", data);
    throw data;
  }

  return data;
};
/* ======================
   TEACHER DELETE LESSON
====================== */

// ======================
// TEACHER DELETE LESSON
// ======================


export const deleteTeacherLesson = async (lessonId) => {
  const res = await fetch(
    `${API}/teacher/lesson/${lessonId}/delete/`,
    {
      method: "DELETE",
      headers: {
        ...authHeader(),
      },
    }
  );

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (e) {}
    console.error("DELETE LESSON ERROR:", res.status, data);
    throw data;
  }

  return true;
};