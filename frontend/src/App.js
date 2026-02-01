import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🌍 Public pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import VerifyCertificate from "./pages/VerifyCertificate";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Notifications from "./pages/Notifications";

// 🎓 Dashboards
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// 📚 Learning pages

import CoursePage from "./pages/CoursePage";
import LessonPage from "./pages/LessonPage";
import QuizPage from "./pages/QuizPage";
import TeacherCourses from "./pages/TeacherCourses";
import AddLesson from "./pages/AddLesson";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherStudents from "./pages/TeacherStudents";

/* =========================
   🔐 ROLE-BASED ROUTE
========================= */
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/verify" element={<VerifyCertificate />} />

        {/* 🔐 AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/notifications" element={<Notifications />} />

        {/* 🎓 STUDENT */}
        <Route
          path="/student/dashboard"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* 👩‍🏫 TEACHER */}
        {/* 👩‍🏫 TEACHER */}
<Route
  path="/teacher/dashboard"
  element={
    <PrivateRoute role="teacher">
      <TeacherDashboard />
    </PrivateRoute>
  }
/>

<Route
  path="/teacher/courses"
  element={
    <PrivateRoute role="teacher">
      <TeacherCourses />
    </PrivateRoute>
  }
/>

<Route
  path="/teacher/add-lesson"
  element={
    <PrivateRoute role="teacher">
      <AddLesson />
    </PrivateRoute>
  }
/>
<Route
  path="/teacher/quizzes"
  element={
    <PrivateRoute role="teacher">
      <TeacherQuizzes />
    </PrivateRoute>
  }
/>

<Route
  path="/teacher/students"
  element={
    <PrivateRoute role="teacher">
      <TeacherStudents />
    </PrivateRoute>
  }
/>

        {/* 🛠 ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* 📚 LEARNING FLOW (STUDENT ONLY) */}
        <Route
          path="/course/:id"
          element={
            <PrivateRoute role="student">
              <CoursePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/lesson/:id"
          element={
            <PrivateRoute role="student">
              <LessonPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <PrivateRoute role="student">
              <QuizPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}