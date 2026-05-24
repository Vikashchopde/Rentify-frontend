import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext.jsx";
import ProfileMenu from "./ProfileMenu.jsx";
import toast from "react-hot-toast";
import { HiMenu, HiX } from "react-icons/hi";
import socket from "../socket.js";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  /* ---------------- SOCKET NOTIFICATIONS ---------------- */
  useEffect(() => {
    if (!user) return;

    const handler = (data) => {
      const { senderName, text, conversationId } = data;

      // 🔔 DEFAULT SYSTEM SOUND + NOTIFICATION
      if (Notification.permission === "granted") {
        const notification = new Notification(senderName || "New Message 💬", {
          body: text || "You received a new message",
        });

        // 🖱️ CLICK → OPEN CHAT
        notification.onclick = () => {
          window.focus();
          navigate(`/chat/${conversationId}`);
          setNotifications([]); // clear badge
          notification.close();
        };
      }

      // 🔴 Badge count (if not on chat page)
      if (!location.pathname.startsWith("/chat")) {
        setNotifications((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handler);

    return () => socket.off("receive_message", handler);
  }, [user, location.pathname, navigate]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = async () => {
    setNotifications([]);
    socket.disconnect();
    await logout();
    toast.success("Logged out!");
  };

  /* ---------------- CLEAR NOTIFICATIONS ---------------- */
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-40">
      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Rentify
      </Link>

      {/* MOBILE MENU BUTTON */}
      <button className="md:hidden text-2xl" onClick={() => setMenu(!menu)}>
        {menu ? <HiX /> : <HiMenu />}
      </button>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-gray-600 hover:text-blue-600">
          Home
        </Link>

        <Link to="/search" className="text-gray-600 hover:text-blue-600">
          Search
        </Link>

        {!user && (
          <>
            <Link to="/signin" className="text-gray-600 hover:text-blue-600">
              Sign In
            </Link>
            <Link to="/signup" className="text-gray-600 hover:text-blue-600">
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-center bg-gray-100 w-10 h-10 rounded-full hover:bg-gray-200 cursor-pointer"
            >
              <img
                src={
                  user?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                className="w-8 h-8 rounded-full object-cover"
                alt="profile"
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-44 p-2 z-50">
                {user.role === "user" && (
                  <>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      User Dashboard
                    </Link>

                    <Link
                      to="/wishlist"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      Wishlist ❤️
                    </Link>
                  </>
                )}

                {user.role === "owner" && (
                  <>
                    <Link
                      to="/owner"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      Owner Dashboard
                    </Link>

                    <Link
                      to="/post"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      Post Listing
                    </Link>

                    <Link
                      to={`/owner/${user.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                  </>
                )}

                {/* CHAT LINK + BADGE */}
                <Link
                  to="/chat"
                  onClick={clearNotifications}
                  className="relative block px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Messages
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {menu && (
        <ProfileMenu close={() => setMobileOpen(false)} />
      )}
    </nav>
  );
}
