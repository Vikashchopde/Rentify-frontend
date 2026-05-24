import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",

  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post("/auth/register", form);

      toast.success("Registration successful!");
      navigate("/signin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="p-8 border rounded-xl shadow-md w-full max-w-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <input
          name="name"
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          name="phone"
          type="text"
          // value={phone}
          onChange={handleChange}
          placeholder="Enter mobile number"
          className="border w-full p-3 rounded-lg mb-4"
        />

        <select
          name="role"
          onChange={handleChange}
          className="w-full border p-3 rounded-lg mb-4"
        >
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
