import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import CoursePage from "./CoursePage";
import LessonPage from "./LessonPage";
import QuizPage from "./QuizPage";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/quiz/:id" element={<QuizPage />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/course/:id"
          element={
            <PrivateRoute>
              <CoursePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/lesson/:id"
          element={
            <PrivateRoute>
              <LessonPage />
            </PrivateRoute>
          }
        
        />
      </Routes>
    </BrowserRouter>
  );
}