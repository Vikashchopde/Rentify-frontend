import React, {
  useEffect,
  useState,
} from "react";
import {
  Link,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import useAuth from "../context/AuthContext";
import RoomCard from "../components/RoomCard";

export default function UserDashboard() {
  const { user } =
    useAuth();

  const userId =
    user?.id;

  const [
    savedRooms,
    setSavedRooms,
  ] = useState([]);

  const [
    recentRooms,
    setRecentRooms,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ================= AUTH =================
  if (!user) {
    return (
      <Navigate to="/signin" />
    );
  }

  // ================= FETCH SAVED =================
  useEffect(() => {
    const fetchWishlist =
      async () => {
        try {
          if (!user)
            return;

          // 1️⃣ Get wishlist ids
          const res =
            await axios.get(
              `/api/wishlist`,
              {
                withCredentials: true,
              }
            );

          const ids =
            res.data || [];

          if (
            ids.length ===
            0
          ) {
            setSavedRooms(
              []
            );

            setLoading(
              false
            );

            return;
          }

          // 2️⃣ Get room data
          const roomRes =
            await axios.post(
              `/api/wishlist/by-ids`,
              {
                ids,
              },
              {
                withCredentials: true,
              }
            );

          setSavedRooms(
            roomRes.data
          );
        } catch (
        err
        ) {
          console.log(
            err
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchWishlist();
  }, [user]);

  // ================= RECENT =================
  useEffect(() => {
    const stored =
      JSON.parse(
        localStorage.getItem(
          "recentViewed"
        )
      ) || [];

    setRecentRooms(
      stored
    );
  }, []);

  // ================= UNIQUE =================
  const uniqueSavedRooms =
    Array.from(
      new Map(
        savedRooms.map(
          (
            item
          ) => [
              (
                item.listing ||
                item
              )._id,
              item,
            ]
        )
      ).values()
    );

  // ================= CLEAR =================
  const handleClearRecent =
    () => {
      localStorage.removeItem(
        "recentViewed"
      );

      setRecentRooms(
        []
      );
    };

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      px-6
      py-10
    "
    >
      <div className="max-w-7xl mx-auto flex flex-wrap gap-8">

        {/* ================= SIDEBAR ================= */}
        <aside
          className="
          bg-white
          border
          border-gray-200
          rounded-[30px]
          shadow-sm
          w-full
          lg:w-[300px]
          p-8
          h-fit
        "
        >
          <h2
            className="
            text-3xl
            font-extrabold
            text-blue-700
            mb-10
          "
          >
            My Account
          </h2>

          <div className="flex flex-col gap-4">

            <Link
              to="/dashboard"
              className="
              px-6
              py-4
              rounded-[20px]
              bg-blue-700
              text-white
              font-semibold
            "
            >
              Dashboard
            </Link>

            <Link
              to="/wishlist"
              className="
              px-6
              py-4
              rounded-[20px]
              bg-gray-100
              hover:bg-gray-200
              transition
            "
            >
              Saved Rooms
            </Link>

            <Link
              to="/chat"
              className="
              px-6
              py-4
              rounded-[20px]
              bg-gray-100
              hover:bg-gray-200
              transition
            "
            >
              Messages
            </Link>

            <Link
              to="/profile"
              className="
              px-6
              py-4
              rounded-[20px]
              bg-gray-100
              hover:bg-gray-200
              transition
            "
            >
              Profile
            </Link>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1">

          {/* HEADER */}
          <div
            className="
            bg-gradient-to-r
            from-blue-700
            to-blue-500
            rounded-[36px]
            p-10
            text-white
            shadow-xl
            mb-10
          "
          >
            <h1 className="text-5xl font-extrabold">
              Welcome Back,
              {" "}
              {
                user.name
              } 👋
            </h1>

            <p className="text-blue-100 mt-4 text-lg">
              Manage your
              saved rooms,
              chats and
              recently viewed
              properties.
            </p>
          </div>

          {/* ================= STATS ================= */}
          <div className="flex flex-wrap gap-6 justify-center mb-12">

            {[
              {
                title:
                  "Saved Rooms",
                value:
                  uniqueSavedRooms.length,
                icon:
                  "❤️",
              },

              {
                title:
                  "Recent Views",
                value:
                  recentRooms.length,
                icon:
                  "👁",
              },

              {
                title:
                  "Messages",
                value:
                  "∞",
                icon:
                  "💬",
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
                  rounded-[30px]
                  shadow-sm
                  hover:shadow-xl
                  transition
                  w-[300px]
                  h-[180px]
                  flex
                  flex-col
                  justify-center
                  items-center
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
                      item.title
                    }
                  </p>
                </div>
              )
            )}
          </div>

          {/* ================= SAVED ================= */}
          <section className="mb-16">

            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Saved Rooms
                </h2>

                <p className="text-gray-500 mt-2">
                  Rooms you
                  liked ❤️
                </p>
              </div>

              <Link
                to="/wishlist"
                className="
                bg-blue-700
                text-white
                px-6
                py-3
                rounded-[18px]
              "
              >
                View All
              </Link>
            </div>

            {loading ? (
              <SkeletonGrid />
            ) : uniqueSavedRooms.length ===
              0 ? (
              <EmptyCard text="No saved rooms yet." />
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {uniqueSavedRooms
                  .slice(0, 3)
                  .map((item) => (
                    <RoomCard
                      key={
                        item._id ||
                        item.listing?._id
                      }
                      item={
                        item
                          .listing ||
                        item
                      }
                    />
                  ))}
              </div>
            )}
          </section>

          {/* ================= RECENT ================= */}
          <section className="mb-16">

            <div className="flex justify-between items-center flex-wrap gap-4 mb-8">

              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Recently
                  Viewed
                </h2>

                <p className="text-gray-500 mt-2">
                  Rooms you
                  explored
                </p>
              </div>

              {recentRooms.length >
                0 && (
                  <button
                    onClick={
                      handleClearRecent
                    }
                    className="
                  bg-red-500
                  hover:bg-red-600
                  text-white
                  px-6
                  py-3
                  rounded-[18px]
                "
                  >
                    Clear
                    History
                  </button>
                )}
            </div>

            {recentRooms.length ===
              0 ? (
              <EmptyCard text="No recent activity yet." />
            ) : (
              <div className="flex flex-wrap justify-center gap-8">
                {recentRooms.map(
                  (
                    item
                  ) => (
                    <RoomCard
                      key={
                        item._id || item.listing._id
                      }
                      item={
                        item
                      }
                    />
                  )
                )}
              </div>
            )}
          </section>

          {/* ================= MESSAGE ================= */}
          <section>

            <div
              className="
              bg-white
              border
              rounded-[36px]
              shadow-sm
              p-10
            "
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Messages
              </h2>

              <p className="text-gray-500 mt-4 text-lg">
                Chat with
                owners and
                manage your
                conversations.
              </p>

              <Link
                to="/chat"
                className="
                inline-block
                mt-8
                bg-blue-700
                text-white
                px-8
                py-4
                rounded-[20px]
                font-semibold
              "
              >
                Go to
                Messages
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ================= EMPTY ================= */

function EmptyCard({
  text,
}) {
  return (
    <div
      className="
      bg-white
      border
      rounded-[30px]
      shadow-sm
      text-center
      p-14
      w-full
    "
    >
      <p className="text-gray-500 text-lg">
        {text}
      </p>
    </div>
  );
}

/* ================= LOADING ================= */

function SkeletonGrid() {
  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {[1, 2, 3].map(
        (
          item
        ) => (
          <div
            key={item}
            className="
            w-[350px]
            h-[500px]
            rounded-[30px]
            bg-gray-200
            animate-pulse
          "
          />
        )
      )}
    </div>
  );
}