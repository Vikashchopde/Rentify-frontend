import { Link } from "react-router-dom";
import React from "react";
import useAuth from "../context/AuthContext";

export default function ProfileMenu({ close }) {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-2">
      <Link to="/" onClick={close}>Home</Link>
      <Link to="/search" onClick={close}>Search</Link>

      {user?.role === "owner" && (
        <>
          <Link to="/dashboard" onClick={close}>Owner Dashboard</Link>
          <Link to="/post" onClick={close}>Post Listing</Link>
          <Link to={`/owner/${user.id}`} onClick={close}>My Profile</Link>
        </>
      )}

      <Link to="/chat" onClick={close}>Messages</Link>

      <button
        onClick={() => {
          localStorage.removeItem("user");
          window.location.href = "/signin";
        }}
        className="text-red-600 text-left"
      >
        Logout
      </button>
    </div>
  );
}
