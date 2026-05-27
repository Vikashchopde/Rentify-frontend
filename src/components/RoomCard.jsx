import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../context/AuthContext";

function RoomCard({
  item,
  wishlistIds = [],
  onRemove,
}) {
  const { user } = useAuth();

  const userId =
    user?._id || user?.id;

  const [loading, setLoading] =
    useState(false);

  // ================= CHECK LIKED =================
  const isLiked =
    wishlistIds.includes(
      item._id
    );

  // ================= TOGGLE WISHLIST =================
  const toggleWishlist =
    async (
      listingId
    ) => {
      try {
        if (!userId) {
          return toast.error(
            "Please login to use wishlist ❤️"
          );
        }

        setLoading(true);

        // REMOVE
        if (isLiked) {
          await axios.post(
            `/api/wishlist/remove`,
            {
              listingId,
            },
            {
              withCredentials: true,
            }
          );

          if (onRemove) {
            onRemove(
              listingId
            );
          }

          toast.success(
            "Removed from wishlist"
          );
        }

        // ADD
        else {
          await axios.post(
            `/api/wishlist/add`,
            {
              listingId,
            },
            {
              withCredentials: true,
            }
          );

          toast.success(
            "Added to wishlist"
          );
        }
      } catch (err) {
        toast.error(
          err.response
            ?.data
            ?.message ||
            "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="
      relative
      bg-white
      rounded-[28px]
      overflow-hidden
      border
      border-gray-200
      shadow-sm
      hover:shadow-2xl
      transition-all
      duration-300
      hover:-translate-y-2
      w-[350px]
      h-[500px]
      flex
      flex-col
      flex-shrink-0
    "
    >
      {/* ❤️ WISHLIST */}
      <button
        type="button"
        disabled={loading}
        onClick={() =>
          toggleWishlist(
            item._id
          )
        }
        className="
        absolute
        top-5
        right-5
        z-20
        w-12
        h-12
        rounded-full
        bg-white/90
        backdrop-blur-sm
        shadow-md
        text-2xl
        flex
        items-center
        justify-center
        hover:scale-110
        transition
      "
      >
        {isLiked
          ? "❤️"
          : "🤍"}
      </button>

      <Link
        to={`/listing/${item._id}`}
        className="flex flex-col h-full"
      >
        {/* IMAGE */}
        <div className="relative w-full h-[240px] overflow-hidden">
          <img
            src={
              item
                .images?.[0] ||
              "https://via.placeholder.com/300"
            }
            alt={
              item.title
            }
            loading="lazy"
            decoding="async"
            className="
            w-full
            h-full
            object-cover
            transition-transform
            duration-500
            hover:scale-110
          "
          />

          {/* CATEGORY */}
          {item.category && (
            <span
              className="
              absolute
              bottom-4
              left-4
              bg-blue-700
              text-white
              px-4
              py-2
              rounded-full
              text-sm
              font-semibold
            "
            >
              {item.category}
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div
          className="
          flex
          flex-col
          justify-between
          flex-1
          p-6
        "
        >
          <div>
            <h3
              className="
              text-2xl
              font-bold
              text-gray-900
              line-clamp-1
            "
            >
              {item.title}
            </h3>

            <p
              className="
              text-gray-500
              mt-3
              text-lg
            "
            >
              📍 {item.city}
              {item.area &&
                ` - ${item.area}`}
            </p>

            <p
              className="
              text-3xl
              font-bold
              text-blue-700
              mt-5
            "
            >
              ₹{item.price}
            </p>
          </div>

          <button
            className="
            w-full
            mt-6
            bg-blue-700
            hover:bg-blue-800
            text-white
            py-4
            rounded-2xl
            font-semibold
            text-lg
            transition
          "
          >
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
}

export default React.memo(RoomCard);