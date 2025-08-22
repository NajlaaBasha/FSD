import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/SignUp.jsx";
import Notes from "./pages/Notes.jsx";
import api from "./api.js";

export default function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me").then(res => setUser(res.data.user)).catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ fontWeight: 700, textDecoration: "none" }}>🗒️ Notes</Link>
        <nav style={{ display: "flex", gap: 12 }}>
          {user ? (
            <>
              <span>Signed in</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main style={{ marginTop: 24 }}>
        <Routes>
          <Route path="/" element={user ? <Notes /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onAuth={setUser} />} />
          <Route path="/signup" element={<Signup onAuth={setUser} />} />
        </Routes>
      </main>
    </div>
  );
}