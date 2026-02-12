import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`https://certificate-verification-backend-7gpb.onrender.com/api/admin/users/?search=${search}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(() => toast.error("Failed to load users"));
  }, [search]);

  return (
    <div className="container">
      <h2>All Users</h2>
      <input
  type="text"
  placeholder="Search users..."
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
      {users.map(u => (
        <div key={u.id} className="card">
          <p><b>{u.username}</b></p>
          <p>{u.email}</p>
          <p><strong>Role:</strong> {u.role}</p>
        </div>
      ))}
    </div>
  );
}