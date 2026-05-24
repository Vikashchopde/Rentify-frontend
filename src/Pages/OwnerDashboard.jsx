import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function OwnerDashboard() {
  const [listings, setListings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [
    activeListings,
    setActiveListings,
  ] = useState(0);

  // ================= FETCH =================
  const fetchListings =
    async () => {
      try {
        setLoading(true);

        const storedUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const ownerId =
          storedUser?.id;

        if (!ownerId) {
          toast.error(
            "User not logged in"
          );

          return;
        }

        const res =
          await axios.get(
            "http://localhost:5000/api/listings",
            {
              params: {
                owner:
                  ownerId,
              },
            }
          );

        setListings(
          res.data
        );

        setActiveListings(
          res.data.length
        );
      } catch (err) {
        toast.error(
          "Failed to fetch listings!"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchListings();
  }, []);

  // ================= DELETE =================
  const deleteListing =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this listing?"
        );

      if (
        !confirmDelete
      )
        return;

      try {
        await axios.delete(
          `http://localhost:5000/api/listings/${id}`,
          {
            withCredentials: true,
          }
        );

        toast.success(
          "Listing deleted!"
        );

        setListings(
          (
            prev
          ) =>
            prev.filter(
              (l) =>
                l._id !==
                id
            )
        );
      } catch {
        toast.error(
          "Failed to delete listing!"
        );
      }
    };

  const totalViews =
    listings.reduce(
      (
        a,
        b
      ) =>
        a +
        (b.views ||
          0),
      0
    );

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      px-6
      py-10
    "
    >
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div
          className="
          flex
          flex-wrap
          justify-between
          items-center
          gap-6
          mb-10
        "
        >
          <div>
            <h1
              className="
              text-4xl
              font-extrabold
              text-gray-900
            "
            >
              Owner Dashboard
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Manage your
              rental listings
              in one place.
            </p>
          </div>

          <Link
            to="/post"
            className="
            bg-blue-700
            hover:bg-blue-800
            text-white
            px-7
            py-4
            rounded-[20px]
            font-semibold
            shadow-lg
            transition
          "
          >
            + Add Listing
          </Link>
        </div>

        {/* ================= STATS ================= */}
        <div
          className="
          flex
          flex-wrap
          gap-6
          justify-center
          mb-14
        "
        >
          {[
            {
              label:
                "Total Listings",
              value:
                activeListings,
              icon:
                "🏠",
            },

            {
              label:
                "Active Listings",
              value:
                activeListings,
              icon:
                "✅",
            },

            {
              label:
                "Total Views",
              value:
                totalViews,
              icon:
                "👁",
            },
          ].map(
            (
              item,
              index
            ) => (
              <div
                key={index}
                className="
                bg-white
                border
                border-gray-200
                rounded-[30px]
                shadow-sm
                hover:shadow-xl
                transition-all
                duration-300
                w-[320px]
                h-[180px]
                flex
                flex-col
                justify-center
                items-center
                text-center
              "
              >
                <span className="text-5xl">
                  {
                    item.icon
                  }
                </span>

                <h2
                  className="
                  text-4xl
                  font-bold
                  text-blue-700
                  mt-4
                "
                >
                  {
                    item.value
                  }
                </h2>

                <p className="text-gray-500 mt-2">
                  {
                    item.label
                  }
                </p>
              </div>
            )
          )}
        </div>

        {/* ================= EMPTY ================= */}
        {!loading &&
          listings.length ===
            0 && (
            <div
              className="
              bg-white
              rounded-[30px]
              border
              shadow-sm
              p-14
              text-center
            "
            >
              <h2 className="text-3xl font-bold text-gray-800">
                No Listings
                Yet
              </h2>

              <p className="text-gray-500 mt-4 text-lg">
                Start posting
                your rental
                listings to
                attract renters.
              </p>

              <Link
                to="/post"
                className="
                inline-block
                mt-8
                bg-blue-700
                text-white
                px-8
                py-4
                rounded-[20px]
                font-semibold
                hover:bg-blue-800
                transition
              "
              >
                Post Listing
              </Link>
            </div>
          )}

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              Loading your
              listings...
            </p>
          </div>
        )}

        {/* ================= LISTINGS ================= */}
        <div
          className="
          flex
          flex-wrap
          justify-center
          gap-8
        "
        >
          {listings.map(
            (
              item
            ) => (
              <div
                key={
                  item._id
                }
                className="
                bg-white
                border
                rounded-[30px]
                overflow-hidden
                shadow-sm
                hover:shadow-2xl
                hover:-translate-y-2
                transition-all
                duration-300
                w-[350px]
               min-h-[620px]
                flex
                flex-col
              "
              >
                {/* IMAGE */}
                <img
                  src={
                    item
                      .images?.[0] ||
                    "https://via.placeholder.com/400"
                  }
                  alt="room"
                  className="
                  h-[230px]
                  w-full
                  object-cover
                "
                />

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
                    <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">
                      {
                        item.title
                      }
                    </h2>

                    <p className="text-gray-500 mt-3 text-lg">
                      📍{" "}
                      {
                        item.city
                      }

                      {item.area &&
                        ` • ${item.area}`}
                    </p>

                    <h3
                      className="
                      text-3xl
                      font-bold
                      text-blue-700
                      mt-5
                    "
                    >
                      ₹
                      {
                        item.price
                      }
                    </h3>

                    <p className="text-gray-400 mt-3">
                      👁{" "}
                      {item.views ||
                        0}{" "}
                      views
                    </p>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-col gap-3 mt-8 pb-2">

                    <Link
                      to={`/listing/${item._id}`}
                      className="
                      bg-gray-100
                      hover:bg-gray-200
                      py-4
                      rounded-[18px]
                      text-center
                      font-semibold
                      transition
                    "
                    >
                      View
                    </Link>

                    <Link
                      to={`/owner/edit/${item._id}`}
                      className="
                      bg-yellow-500
                      hover:bg-yellow-600
                      text-white
                      py-4
                      rounded-[18px]
                      text-center
                      font-semibold
                      transition
                    "
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        deleteListing(
                          item._id
                        )
                      }
                      className="
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      py-4
                      rounded-[18px]
                      font-semibold
                      transition
                    "
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}