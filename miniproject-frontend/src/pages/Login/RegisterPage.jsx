import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
    age: "",
    address: "",
    work: "",
    landType: "",
    contact: "",
    cropInterest: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      alert("Username and password are required!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(form);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="work" placeholder="Occupation / Work" value={form.work} onChange={handleChange} />
        <select name="landType" value={form.landType} onChange={handleChange}>
          <option value="">Select Land Type</option>
          <option value="sky">Sky Dependent</option>
          <option value="river">River Dependent</option>
          <option value="home">Home Purpose</option>
        </select>
        <input name="contact" placeholder="Contact Info" value={form.contact} onChange={handleChange} />
        <input name="cropInterest" placeholder="Crop Preference / Interest" value={form.cropInterest} onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;



