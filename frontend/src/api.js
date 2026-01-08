const API_URL = "http://127.0.0.1:8000/api";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function getStudents(token) {
  const res = await fetch(`${API_URL}/students/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}