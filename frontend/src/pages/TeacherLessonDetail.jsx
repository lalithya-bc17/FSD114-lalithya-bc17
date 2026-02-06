import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteTeacherLesson } from "../api";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function TeacherLessonDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [lesson, setLesson] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lessonId) return;

    const loadLesson = async () => {
      try {
        const res = await fetch(
          `${API}/teacher/lesson/${lessonId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error();

        const data = await res.json();
        setLesson(data);
        setTitle(data.title || "");
        setContent(data.content || "");
        setVideoUrl(data.video_url || "");
      } catch {
        toast.error("Lesson not found or access denied");
        setLesson(null);
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [lessonId, token]);

  // 💾 SAVE LESSON
  const saveLesson = async () => {
    try {
      const res = await fetch(
        `${API}/teacher/lesson/${lessonId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            content,
            video_url: videoUrl,
          }),
        }
      );

      if (!res.ok) throw new Error();
      toast.success("Lesson saved ✅");
    } catch {
      toast.error("Permission denied ❌");
    }
  };

  // 🗑 DELETE LESSON (ONLY HERE)
  const handleDelete = async () => {
    if (!window.confirm("Delete this lesson?")) return;

    try {
      await deleteTeacherLesson(lessonId);
      toast.success("Lesson deleted ✅");
      navigate(-1);
    } catch {
      toast.error("Cannot delete lesson ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="container">
      <h2>Edit Lesson</h2>

      <input
        placeholder="Lesson title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Lesson content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input
        placeholder="Video URL (Cloudinary / YouTube)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <button onClick={saveLesson}>Save Lesson</button>
      <button onClick={handleDelete}>Delete Lesson</button>
      <button onClick={() => navigate(`/teacher/lesson/${lessonId}/quiz`)}>
       Add / Edit Quiz
      </button>
    </div>
  );
}