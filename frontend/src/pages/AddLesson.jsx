import { useState } from "react";
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function AddLesson() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [courseId, setCourseId] = useState("");
  const [order, setOrder] = useState("");

  const token = localStorage.getItem("access");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API}/teacher/add-lesson/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        content,
        course: courseId,
        order,
      }),
    });

    if (res.ok) {
      toast.success("Lesson created ✅");
      setTitle("");
      setContent("");
      setCourseId("");
      setOrder("");
    } else {
      toast.error("Failed to create lesson ❌");
    }
  };

  return (
    <div className="container">
      <h2>Add Lesson</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        />

        <input
          placeholder="Lesson Order"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />

        <input
          placeholder="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Lesson Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button type="submit">Create Lesson</button>
      </form>
    </div>
  );
}
