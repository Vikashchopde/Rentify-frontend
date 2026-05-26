import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

// Pages
import Home from "./Pages/Home.jsx";
import Search from "./Pages/Search.jsx";
import Listing from "./Pages/Listings.jsx";
import PostListing from "./Pages/PostListings.jsx";
import SignIn from "./Pages/SignIn.jsx";
import SignUp from "./Pages/SignUp.jsx";
import OwnerDashboard from "./Pages/OwnerDashboard.jsx";
import UserDashboard from "./Pages/UserDashboard.jsx";
import OwnerProfile from "./Pages/ownerProfile.jsx";
import Chat from "./Pages/Chat.jsx";
import Wishlist from "./Pages/wishlist.jsx";
import UserProfile from "./Pages/UserProfile.jsx";
import EditListing from "./Pages/EditListing.jsx";

import useAuth from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const { user } = useAuth();
  const userId = user?.id;

  /* ---------------- SOCKET ONLINE STATUS ---------------- */
  useEffect(() => {
    if (!userId) return;

    const socket = io(import.meta.env.VITE_API_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.emit("user_online", userId);

    return () => {
      socket.emit("user_offline", userId);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <>
      {/* 🔔 GLOBAL TOAST PROVIDER (MANDATORY) */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            zIndex: 9999,
          },
        }}
      />

      <Navbar />

      <div className="pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/listing/:id" element={<Listing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/owner/:ownerId" element={<OwnerProfile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/owner/edit/:id" element={<EditListing />} />


          {/* Chat */}
          <Route path="/chat/:conversationId" element={<Chat />} />

          {/* Owner Protected */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute role="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post"
            element={
              <ProtectedRoute role="owner">
                <PostListing />
              </ProtectedRoute>
            }
          />

          {/* User Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </>
  );
}
