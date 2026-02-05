import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const API = "http://127.0.0.1:8000/api";

export default function TeacherLessonDetail() {
  const { lessonId } = useParams();
  const token = localStorage.getItem("access");
  console.log("TOKEN:", token);

  const [lesson, setLesson] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

      if (!res.ok) throw new Error("Forbidden");

      const data = await res.json();
      setLesson(data);
      setVideoUrl(data.video_url || "");
    } catch (err) {
      toast.error("You are not allowed to edit this lesson");
    } finally {
      setLoading(false);
    }
  };

  loadLesson();
}, [lessonId, token]);

  const saveVideo = async () => {
    const res = await fetch(
      `${API}/teacher/lesson/${lessonId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          video_url: videoUrl,
        }),
      }
    );

    if (res.ok) {
      toast.success("Video added ✅");
    } else {
      toast.error("Permission denied ❌");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!lesson) return <p>Lesson not found</p>;

  return (
    <div className="container">
      <h2>Edit Lesson: {lesson.title}</h2>

      <input
        placeholder="Video URL (Cloudinary / YouTube)"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
      />

      <button onClick={saveVideo}>Save Video</button>
    </div>
  );
}