import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);

  // CREATE COURSE STATE
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // EDIT COURSE STATE ⭐ NEW
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editCourse, setEditCourse] = useState({
    title: "",
    description: "",
  });

  const token = localStorage.getItem("access");
  const navigate = useNavigate();

  // ================= LOAD COURSES =================
  const loadCourses = useCallback(() => {
    fetch(`${API}/teacher/my-courses/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch(() => toast.error("Failed to load courses"));
  }, [token]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // ================= CREATE COURSE =================
  const createCourse = () => {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }

    fetch(`${API}/teacher/create-course/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(() => {
        setTitle("");
        setDescription("");
        loadCourses();
        toast.success("Course created");
      })
      .catch(() => toast.error("Error creating course"));
  };

  // ================= UPDATE COURSE ⭐ NEW =================
  const updateCourse = async () => {
    try {
      const res = await fetch(
        `${API}/teacher/course/${editingCourseId}/update/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editCourse),
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Course updated");
      setEditingCourseId(null);
      setEditCourse({ title: "", description: "" });
      loadCourses();
    } catch {
      toast.error("Failed to update course");
    }
  };

  return (
    <div className="container">
      <h2>My Courses</h2>

      {/* ===== EDIT COURSE FORM ⭐ NEW ===== */}
      {editingCourseId && (
        <div className="card">
          <h3>Edit Course</h3>

          <input
            placeholder="Course title"
            value={editCourse.title}
            onChange={(e) =>
              setEditCourse({ ...editCourse, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={editCourse.description}
            onChange={(e) =>
              setEditCourse({ ...editCourse, description: e.target.value })
            }
          />

          <button onClick={updateCourse}>Update Course</button>
          <button onClick={() => setEditingCourseId(null)}>Cancel</button>
        </div>
      )}

      {/* ===== CREATE COURSE ===== */}
      <div className="card">
        <input
          placeholder="Course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={createCourse}>Create Course</button>
      </div>

      <hr />

      {/* ===== COURSE LIST ===== */}
      {courses.length === 0 && <p>No courses yet</p>}

      {courses.map((course) => (
        <div key={course.id} className="card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>

          <button
            onClick={() => {
              setEditingCourseId(course.id);
              setEditCourse({
                title: course.title,
                description: course.description,
              });
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Edit
          </button>

          <button onClick={() => navigate(`/teacher/course/${course.id}`)}>
            Manage
          </button>
        </div>
      ))}
    </div>
  );
}