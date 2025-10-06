import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = e => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === form.username && u.password === form.password);

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("currentUser", JSON.stringify(user));
      navigate("/home");
    } else {
      alert("Invalid username or password!");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit">Login</button>
        <p>
          Don't have an account? <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
