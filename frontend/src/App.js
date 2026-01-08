import { useState } from "react";
import { login, getStudents } from "./api";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [students, setStudents] = useState([]);

  const handleLogin = async () => {
    const data = await login(username, password);
    if (data.access) {
      setToken(data.access);
      alert("Login success");
    } else {
      alert("Login failed");
    }
  };

  const loadStudents = async () => {
    const data = await getStudents(token);
    setStudents(data);
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>EduVillage Login</h2>

      <input placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />

      <br/><br/>

      <input placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={handleLogin}>Login</button>

      <hr/>

      <button onClick={loadStudents}>Load Students</button>

      <ul>
        {students.map(s => (
          <li key={s.id}>
            {s.roll_number} — {s.department}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;