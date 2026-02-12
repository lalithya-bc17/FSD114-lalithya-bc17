import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🌍 Public pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
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

// 👩‍🏫 Teacher pages
import TeacherCourses from "./pages/TeacherCourses";
import TeacherCourseDetail from "./pages/TeacherCourseDetail";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherLessonDetail from "./pages/TeacherLessonDetail";
import TeacherLessonQuiz from "./pages/TeacherLessonQuiz";
import TeacherCertificates from "./pages/TeacherCertificates";
import TeacherCourseAnalytics from "./pages/TeacherCourseAnalytics";

// 🛠 Admin pages
import AdminUsers from "./pages/AdminUsers";
import AdminCourses from "./pages/AdminCourses";
import AdminEnrollments from "./pages/AdminEnrollments";
import AdminCertificates from "./pages/AdminCertificates";

/* =========================
   🔐 ROLE-BASED ROUTE
========================= */
function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("access");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
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
          path="/teacher/course/:courseId"
          element={
            <PrivateRoute role="teacher">
              <TeacherCourseDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/lesson/:lessonId"
          element={
            <PrivateRoute role="teacher">
              <TeacherLessonDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/lesson/:lessonId/quiz"
          element={
            <PrivateRoute role="teacher">
              <TeacherLessonQuiz />
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

        <Route
          path="/teacher/certificates"
          element={
            <PrivateRoute role="teacher">
              <TeacherCertificates />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/course/:courseId/analytics"
          element={
            <PrivateRoute role="teacher">
              <TeacherCourseAnalytics />
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

        <Route
          path="/admin/users"
          element={
            <PrivateRoute role="admin">
              <AdminUsers />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <PrivateRoute role="admin">
              <AdminCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/enrollments"
          element={
            <PrivateRoute role="admin">
              <AdminEnrollments />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/certificates"
          element={
            <PrivateRoute role="admin">
              <AdminCertificates />
            </PrivateRoute>
          }
        />

      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}