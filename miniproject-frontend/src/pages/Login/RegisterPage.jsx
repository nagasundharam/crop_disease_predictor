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
    occupation: "",
    landType: "",
    contactInfo: "",
    cropPreference: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      alert("Username and password are required!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("✅ Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} />
        <select name="landType" value={form.landType} onChange={handleChange}>
          <option value="">Select Land Type</option>
          <option value="sky">Sky Dependent</option>
          <option value="river">River Dependent</option>
          <option value="home">Home Purpose</option>
        </select>
        <input name="contactInfo" placeholder="Contact Info" value={form.contactInfo} onChange={handleChange} />
        <input name="cropPreference" placeholder="Crop Preference / Interest" value={form.cropPreference} onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
