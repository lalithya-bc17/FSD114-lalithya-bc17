import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  // ✅ STABLE function (important)
  const loadCourses = useCallback(() => {
    fetch(`${API}/teacher/my-courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, [token]);

  // ✅ Load once on page load
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // ✅ Create course
  const createCourse = () => {
    if (!title.trim()) {
      alert("Title required");
      return;
    }

    fetch(`${API}/teacher/create-course/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Create failed");
        return res.json();
      })
      .then(() => {
        setTitle("");
        setDescription("");
        loadCourses(); // ✅ now works
        alert("Course created");
      })
      .catch(() => alert("Error creating course"));
  };

  return (
    <div className="container">
      <h2>My Courses</h2>

      {/* CREATE COURSE */}
      <div className="card">
        <input
          placeholder="Course title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={createCourse}>Create Course</button>
      </div>

      <hr />

      {/* COURSE LIST */}
      {courses.length === 0 && <p>No courses yet</p>}

      {courses.map(course => (
  <div key={course.id} className="card">
    <h3>{course.title}</h3>
    <p>{course.description}</p>

    <button onClick={() => navigate(`/teacher/course/${course.id}`)}>
      Manage
    </button>
  </div>
))}
    </div>
  );
}