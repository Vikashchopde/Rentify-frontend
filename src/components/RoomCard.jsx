import React, {
  useState,
  useEffect,
} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../context/AuthContext";

export default function RoomCard({
  item,
  wishlistIds,
  onRemove,
}) {
  const { user } =
    useAuth();

  const userId =
    user?.id;

  const [wishlist, setWishlist] =
    useState([]);

  // ================= FETCH WISHLIST =================
  useEffect(() => {
    if (
      !user ||
      !userId
    )
      return;

    axios
      .get(
        "http://localhost:5000/api/wishlist",
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setWishlist(
          res.data || []
        );
      })
      .catch((err) => {
        toast.error(
          err.response
            ?.data
            ?.message ||
            "Failed to fetch wishlist"
        );
      });
  }, [user, userId]);

  // ================= TOGGLE WISHLIST =================
  const toggleWishlist =
    async (
      listingId
    ) => {
      try {
        if (
          !userId
        ) {
          return toast.error(
            "Please login to use wishlist ❤️"
          );
        }

        const alreadyLiked =
          wishlist.some(
            (
              item
            ) => {
              if (
                typeof item ===
                "string"
              ) {
                return (
                  item ===
                  listingId
                );
              }

              return (
                item.listing ===
                  listingId ||
                item._id ===
                  listingId
              );
            }
          );

        // REMOVE
        if (
          alreadyLiked
        ) {
          await axios.post(
            "http://localhost:5000/api/wishlist/remove",
            {
              listingId,
            },
            {
              withCredentials: true,
            }
          );

          if (
            onRemove
          ) {
            onRemove(
              listingId
            );
          }

          setWishlist(
            (
              prev
            ) =>
              prev.filter(
                (
                  item
                ) => {
                  if (
                    typeof item ===
                    "string"
                  ) {
                    return (
                      item !==
                      listingId
                    );
                  }

                  return (
                    item.listing !==
                      listingId &&
                    item._id !==
                      listingId
                  );
                }
              )
          );

          toast.success(
            "Removed from wishlist"
          );
        }

        // ADD
        else {
          await axios.post(
            "http://localhost:5000/api/wishlist/add",
            {
              listingId,
            },
            {
              withCredentials: true,
            }
          );

          setWishlist(
            (
              prev
            ) => [
              ...prev,
              listingId,
            ]
          );

          toast.success(
            "Added to wishlist"
          );
        }
      } catch (
        err
      ) {
        toast.error(
          err.response
            ?.data
            ?.message ||
            "Something went wrong"
        );
      }
    };

  // ================= CHECK LIKED =================
  const isLiked =
    wishlistIds
      ? wishlistIds.includes(
          item._id
        )
      : wishlist.some(
          (w) => {
            if (
              typeof w ===
              "string"
            ) {
              return (
                w ===
                item._id
              );
            }

            return (
              w.listing ===
                item._id ||
              w._id ===
                item._id
            );
          }
        );

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
    "
    >
      {/* ❤️ WISHLIST */}
      <button
        type="button"
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
              {
                item.category
              }
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
              {
                item.title
              }
            </h3>

            <p
              className="
              text-gray-500
              mt-3
              text-lg
            "
            >
              📍{" "}
              {
                item.city
              }

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
              ₹
              {item.price}
            </p>
          </div>

          {/* BUTTON */}
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