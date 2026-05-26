import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const { setUser } = useAuth();


  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `/api/auth/login`,
        form,
        {
          withCredentials: true,
        }
      );

      if (!res.data.user) {
        toast.error("Login failed: No user returned");
        return;
      }

      // ⭐ FIXED — Save user in localStorage properly
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      setUser(res.data.user);
      navigate("/");

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };


  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="p-8 border rounded-xl shadow-md w-full max-w-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

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

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
