import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

// 👩‍🏫 Teacher pages
import TeacherCourses from "./pages/TeacherCourses";
import TeacherCourseDetail from "./pages/TeacherCourseDetail";
import TeacherQuizzes from "./pages/TeacherQuizzes";
import TeacherStudents from "./pages/TeacherStudents";
import TeacherLessonDetail from "./pages/TeacherLessonDetail";
import TeacherLessonQuiz from "./pages/TeacherLessonQuiz";


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

        {/* 📚 STUDENT LEARNING FLOW */}
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

        {/* 👩‍🏫 TEACHER LESSON EDIT */}
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

        {/* 🛠 ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* 🔔 TOASTS */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}