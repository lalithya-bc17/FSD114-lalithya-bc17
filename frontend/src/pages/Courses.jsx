import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enrollCourse } from "../api"; // ✅ this path is correct if api.js is in src/
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/courses/?search=${search}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else if (Array.isArray(data.results)) {
          setCourses(data.results);
        } else {
          setCourses([]);
        }
      })
      .finally(() => setLoading(false));
  }, [search]);

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse(courseId);
      toast.success("Enrolled successfully!");
      navigate("/student/dashboard",{ replace: true }); // ✅ redirect after enroll
    } catch (err) {
      toast.error("Already enrolled or error occurred");
    }
  };

  if (loading) return <p>Loading courses...</p>;

  return (
  <div style={{ padding: 20 }}>
    <h2>Available Courses</h2>

    {/* 🔍 SEARCH INPUT — ADD HERE */}
    <input
      type="text"
      placeholder="Search courses..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px",
        width: "100%",
        maxWidth: "400px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />

    {courses.length === 0 && <p>No courses available</p>}

    {courses.map((course) => (
      <div
        key={course.id}
        style={{
          border: "1px solid #ccc",
          margin: 10,
          padding: 15,
          borderRadius: 8,
        }}
      >
        <h3>{course.title}</h3>
        <p>{course.description}</p>

        <button onClick={() => handleEnroll(course.id)}>
          Enroll
        </button>
      </div>
    ))}
  </div>
);
}