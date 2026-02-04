import { useEffect, useState } from "react";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access");

  // 🔹 Load teacher courses
  const loadCourses = () => {
    fetch(`${API}/teacher/my-courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // 🔹 Create new course (TEACHER ONLY)
  const createCourse = () => {
    if (!title) {
      alert("Title required");
      return;
    }

    setLoading(true);

    fetch(`${API}/teacher/create-course/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to create");
        return res.json();
      })
      .then(() => {
        setTitle("");
        setDescription("");
        loadCourses();
        alert("Course created");
      })
      .catch(err => {
        console.error(err);
        alert("Error creating course");
      })
      .finally(() => setLoading(false));
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
        <button onClick={createCourse} disabled={loading}>
          {loading ? "Creating..." : "Create Course"}
        </button>
      </div>

      <hr />

      {/* COURSE LIST */}
      {courses.length === 0 && <p>No courses yet</p>}

      {courses.map(course => (
        <div key={course.id} className="card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}