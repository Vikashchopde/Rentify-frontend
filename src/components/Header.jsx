import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../context/AuthContext.jsx";
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

  /* ---------------- NOTIFICATION PERMISSION ---------------- */
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

      if (Notification.permission === "granted") {
        const notification = new Notification(
          senderName || "New Message 💬",
          {
            body: text || "You received a new message",
          }
        );

        notification.onclick = () => {
          window.focus();
          navigate(`/chat/${conversationId}`);
          setNotifications([]);
          notification.close();
        };
      }

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
    navigate("/signin");
  };

  /* ---------------- CLEAR NOTIFICATIONS ---------------- */
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Rentify
        </Link>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <HiX /> : <HiMenu />}
        </button>

        {/* DESKTOP / TABLET MENU */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/search"
            className="text-gray-600 hover:text-blue-600"
          >
            Search
          </Link>

          {!user ? (
            <>
              <Link
                to="/signin"
                className="text-gray-600 hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center bg-gray-100 w-10 h-10 rounded-full hover:bg-gray-200"
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
                <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-52 p-2 z-50">

                  {/* USER MENU */}
                  {user.role === "user" && (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        User Dashboard
                      </Link>

                      <Link
                        to="/wishlist"
                        className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        Wishlist ❤️
                      </Link>
                    </>
                  )}

                  {/* OWNER MENU */}
                  {user.role === "owner" && (
                    <>
                      <Link
                        to="/owner"
                        className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        Owner Dashboard
                      </Link>

                      <Link
                        to="/post"
                        className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        Post Listing
                      </Link>

                      <Link
                        to={`/owner/${user.id}`}
                        className="block px-3 py-2 hover:bg-gray-100 rounded-lg"
                      >
                        My Profile
                      </Link>
                    </>
                  )}

                  {/* CHAT */}
                  <Link
                    to="/chat"
                    onClick={clearNotifications}
                    className="relative block px-3 py-2 hover:bg-gray-100 rounded-lg"
                  >
                    Messages

                    {notifications.length > 0 && (
                      <span className="absolute top-2 right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </Link>

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-lg text-red-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menu && (
        <div className="md:hidden mt-4 border-t pt-4 flex flex-col gap-4">

          <Link
            to="/"
            onClick={() => setMenu(false)}
            className="text-gray-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/search"
            onClick={() => setMenu(false)}
            className="text-gray-700 hover:text-blue-600"
          >
            Search
          </Link>

          {!user ? (
            <>
              <Link
                to="/signin"
                onClick={() => setMenu(false)}
                className="text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>

              <Link
                to="/signup"
                onClick={() => setMenu(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user.role === "user" && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMenu(false)}
                  >
                    User Dashboard
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setMenu(false)}
                  >
                    Wishlist ❤️
                  </Link>
                </>
              )}

              {user.role === "owner" && (
                <>
                  <Link
                    to="/owner"
                    onClick={() => setMenu(false)}
                  >
                    Owner Dashboard
                  </Link>

                  <Link
                    to="/post"
                    onClick={() => setMenu(false)}
                  >
                    Post Listing
                  </Link>

                  <Link
                    to={`/owner/${user.id}`}
                    onClick={() => setMenu(false)}
                  >
                    My Profile
                  </Link>
                </>
              )}

              <Link
                to="/chat"
                onClick={() => {
                  clearNotifications();
                  setMenu(false);
                }}
                className="relative"
              >
                Messages

                {notifications.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </Link>

              <button
                onClick={async () => {
                  await handleLogout();
                  setMenu(false);
                }}
                className="text-left text-red-500"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}