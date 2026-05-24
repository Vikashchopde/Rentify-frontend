import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ReviewList({ reviews, listingId, loggedUser, onSuccess }) {
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState("");

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${listingId}/${reviewId}`);
      toast.success("Review deleted!");
      onSuccess();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const updateReview = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reviews/${listingId}/${reviewId}`,
        { rating: editRating, comment: editComment }
      );

      toast.success("Review updated!");
      setEditingReview(null);
      onSuccess();
    } catch (err) {
      toast.error("Failed to update review");
    }
  };

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-600">No reviews yet.</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((rev) => {
        const isMine = loggedUser && loggedUser.id === rev.user?._id;

        return (
          <div key={rev._id} className="p-4 border rounded-xl bg-white shadow-sm">
            {editingReview === rev._id ? (
              <>
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>{r} Star</option>
                  ))}
                </select>

                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="border p-2 rounded w-full mt-2"
                />

                <button
                  onClick={() => updateReview(rev._id)}
                  className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingReview(null)}
                  className="mt-2 ml-2 bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-yellow-500 font-semibold">⭐ {rev.rating}/5</p>
                <p className="text-gray-800 mt-1">{rev.comment}</p>
                <p className="text-sm text-gray-500 mt-1">— {rev.user?.name}</p>

                {isMine && (
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => {
                        setEditingReview(rev._id);
                        setEditRating(rev.rating);
                        setEditComment(rev.comment);
                      }}
                      className="text-blue-600 font-semibold cursor-pointer "
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteReview(rev._id)}
                      className="text-red-600 font-semibold cursor-pointer "
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
