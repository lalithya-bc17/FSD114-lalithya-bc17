import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("access");

  // Fetch notifications
  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch(
        "https://certificate-verification-backend-7gpb.onrender.com/api/notifications/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      toast.error("Failed to load notifications");
    }
  }, [token]); // ✅ dependency handled correctly

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await fetch(
        `https://certificate-verification-backend-7gpb.onrender.com/api/notifications/${id}/read/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      loadNotifications(); // refresh list
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  // Load on mount
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]); // ✅ ESLint satisfied

  return (
    <div style={{ padding: "20px", maxWidth: "700px", margin: "auto" }}>
      <h2>🔔 Notifications</h2>

      {notifications.length === 0 && (
        <p style={{ color: "#777" }}>No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: n.is_read ? "#fff" : "#eef9f8",
            borderLeft: "5px solid #1B9AAA",
            borderRadius: "8px",
            padding: "15px 20px",
            marginBottom: "15px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            fontWeight: n.is_read ? "normal" : "bold",
          }}
        >
          <div style={{ fontSize: "16px", marginBottom: "6px" }}>
            {n.title || "Notification"}
          </div>

          <div style={{ fontSize: "14px", marginBottom: "8px", fontWeight: "normal" }}>
            {n.message}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <span>{new Date(n.created_at).toLocaleString()}</span>

            {!n.is_read ? (
              <button
                onClick={() => markAsRead(n.id)}
                style={{
                  fontSize: "12px",
                  color: "#1B9AAA",
                  border: "1px solid #1B9AAA",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                Mark as read
              </button>
            ) : (
              <span>✔ Read</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}