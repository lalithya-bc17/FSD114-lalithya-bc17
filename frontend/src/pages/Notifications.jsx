import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";

const API = "https://certificate-verification-backend-7gpb.onrender.com/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("access");

  const loadNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API}/notifications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    }
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await fetch(`${API}/notifications/${id}/read/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      loadNotifications();
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <div style={{ maxWidth: "720px", margin: "20px auto", padding: "10px" }}>
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
            padding: "14px 18px",
            marginBottom: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ fontSize: "14px", marginBottom: "6px" }}>
            {n.message}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              color: "#666",
            }}
          >
            <span>{new Date(n.created_at).toLocaleString()}</span>

            {!n.is_read ? (
              <button
                onClick={() => markAsRead(n.id)}
                style={{
                  border: "1px solid #1B9AAA",
                  background: "transparent",
                  color: "#1B9AAA",
                  padding: "3px 8px",
                  borderRadius: "4px",
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