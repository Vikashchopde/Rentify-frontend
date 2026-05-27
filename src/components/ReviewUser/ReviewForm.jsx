import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../context/AuthContext";

export default function ReviewForm({ listingId, onSuccess }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const { user } = useAuth(); // ✅ move here

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return toast.error("Please login to submit a review ❤️");
    }

    if (!rating || !comment.trim()) {
      return toast.error("Please fill all fields");
    }

    try {
      await axios.post(`/api/reviews/${listingId}`, {
        userId: user?.id || user?._id, // ✅ safer
        rating,
        comment,
      });

      toast.success("Review added successfully!");

      // Reset fields
      setRating("");
      setComment("");

      // Refresh reviews
      if (onSuccess) onSuccess();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-5 border rounded-xl bg-gray-50 shadow-sm"
    >
      <h3 className="font-semibold mb-3">
        Write a Review
      </h3>

      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-3 rounded-lg w-full"
        required
      >
        <option value="">Select Rating</option>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} Star
          </option>
        ))}
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your experience..."
        className="border p-3 rounded-lg w-full mt-3 h-24"
        required
      />

      <button
        type="submit"
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full"
      >
        Submit Review
      </button>
    </form>
  );
}