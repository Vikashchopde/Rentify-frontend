import React, { useEffect, useState } from "react";
import axios from "axios";
import RoomCard from "../components/RoomCard";
import useAuth from "../context/AuthContext";

export default function Wishlist() {
  const [rooms, setRooms] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]); // ⭐ FIXED

  const { user } = useAuth();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // 1️⃣ Get wishlist IDs
        if (!user) return;
        const res = await axios.get(
          `/api/wishlist`,
          {
            withCredentials: true,
          }
        );
        const ids = res.data;

        setWishlistIds(ids); // ⭐ FIXED → store for heart color

        if (!ids || ids.length === 0) {
          setRooms([]);
          return;
        }

        // 2️⃣ Fetch full listing details
        const roomRes = await axios.post(
          `/api/wishlist/by-ids`,
          {
            ids,
          },
          {
            withCredentials: true,
          }
        );

        setRooms(roomRes.data);
      } catch (err) {
        // res.send(err);
        console.log(err);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleRemove = (id) => {
    // remove from UI instantly
    setRooms((prev) => prev.filter((room) => room._id !== id));
    setWishlistIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ❤️</h1>

      <div className="flex flex-wrap gap-6">
        {rooms.map((room) => (
          <RoomCard
            item={room}
            wishlistIds={wishlistIds} // ⭐ FIXED
            key={room._id}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
