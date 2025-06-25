import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import "../styles/AuthForm.css";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <div className="auth-form">
        <label>Username</label>
        <input name="username" onChange={handleChange} value={form.username} />
        <label>Email</label>
        <input name="email" type="email" onChange={handleChange} value={form.email} />
        <label>Password</label>
        <input name="password" type="password" onChange={handleChange} value={form.password} />
        <button className="auth-button" onClick={handleRegister}>Register</button>
      </div>
      <div className="auth-toggle">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}

export default Register;
