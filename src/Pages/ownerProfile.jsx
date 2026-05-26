import React, {
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import useAuth from "../context/AuthContext";
import toast from "react-hot-toast";
import RoomCard from "../components/RoomCard";

export default function OwnerProfile() {
  const { ownerId } =
    useParams();

  const {
    user,
    setUser,
  } = useAuth();

  const isOwner =
    user?.id ===
      ownerId ||
    user?._id ===
      ownerId;

  const [
    owner,
    setOwner,
  ] = useState(
    null
  );

  const [
    rooms,
    setRooms,
  ] = useState(
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    edit,
    setEdit,
  ] = useState(
    false
  );

  const [
    form,
    setForm,
  ] = useState(
    {
      name: "",
      phone: "",
      profileImage:
        "",
    }
  );

  // ================= FETCH OWNER =================
  useEffect(() => {
    const fetchOwner =
      async () => {
        try {
          const res =
            await axios.get(
              `/api/owner/${ownerId}`
            );

          setOwner(
            res.data
              .owner
          );

          setRooms(res.data?.listings || []);

          setForm({
            name:
              res
                .data
                .owner
                .name ||
              "",

            phone:
              res
                .data
                .owner
                .phone ||
              "",

            profileImage:
              res
                .data
                .owner
                .profileImage ||
              "",
          });
        } catch {
          toast.error(
            "Failed to load profile"
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchOwner();
  }, [ownerId]);

  // ================= IMAGE =================
  const handleImage =
    (e) => {
      const file =
        e.target
          .files[0];

      if (!file)
        return;

      const reader =
        new FileReader();

      reader.onloadend =
        () => {
          setForm({
            ...form,
            profileImage:
              reader.result,
          });
        };

      reader.readAsDataURL(
        file
      );
    };

  // ================= SAVE =================
  const saveProfile =
    async () => {
      try {
        const res =
          await axios.put(
            `/api/owner/${ownerId}`,
            form,
            {
              withCredentials: true,
            }
          );

        setOwner(
          res.data
            .user
        );

        setUser(
          res.data
            .user
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            res.data
              .user
          )
        );

        toast.success(
          "Profile updated ❤️"
        );

        setEdit(
          false
        );
      } catch {
        toast.error(
          "Update failed"
        );
      }
    };

  if (loading)
    return <Loader />;

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      px-6
      py-12
    "
    >
      <div className="max-w-7xl mx-auto">

        {/* ================= PROFILE CARD ================= */}
        <div
          className="
          bg-white
          rounded-[36px]
          shadow-sm
          border
          border-gray-200
          overflow-hidden
          mb-16
        "
        >

          {/* TOP */}
          <div
            className="
            bg-gradient-to-r
            from-blue-700
            to-blue-500
            h-[180px]
          "
          ></div>

          {/* PROFILE CONTENT */}
          <div className="px-8 pb-10">

            <div
              className="
              flex
              flex-wrap
              gap-8
              items-center
              -mt-20
            "
            >

              {/* IMAGE */}
              <img
                src={
                  form.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                }
                alt="owner"
                className="
                w-40
                h-40
                rounded-full
                border-[6px]
                border-white
                shadow-xl
                object-cover
                bg-white
              "
              />

              {/* DETAILS */}
              {edit ? (
                <div className="flex-1 flex flex-col gap-4">

                  <input
                    value={
                      form.name
                    }
                    onChange={(
                      e
                    ) =>
                      setForm(
                        {
                          ...form,
                          name:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                    placeholder="Name"
                    className="border rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    value={
                      form.phone
                    }
                    onChange={(
                      e
                    ) =>
                      setForm(
                        {
                          ...form,
                          phone:
                            e
                              .target
                              .value,
                        }
                      )
                    }
                    placeholder="Phone"
                    className="border rounded-2xl px-5 py-4 outline-none"
                  />

                  <input
                    type="file"
                    onChange={
                      handleImage
                    }
                    className="border rounded-2xl p-3"
                  />

                  <button
                    onClick={
                      saveProfile
                    }
                    className="
                    bg-blue-700
                    hover:bg-blue-800
                    text-white
                    py-4
                    rounded-[20px]
                    font-semibold
                    transition
                  "
                  >
                    Save Profile
                  </button>
                </div>
              ) : (
                <div className="flex-1">

                  <h1
                    className="
                    text-4xl
                    font-extrabold
                    text-gray-900
                  "
                  >
                    {
                      owner?.name
                    }
                  </h1>

                  <p className="text-white mt-3 text-lg">
                    ✉️{" "}
                    {
                      owner?.email
                    }
                  </p>

                  <p className="text-gray-500 mt-2 text-lg">
                    📞{" "}
                    {
                      owner?.phone
                    }
                  </p>

                  <div className="flex gap-4 mt-6 flex-wrap">

                    <div
                      className="
                      bg-blue-50
                      text-blue-700
                      px-6
                      py-3
                      rounded-full
                      font-semibold
                    "
                    >
                      {rooms.length}{" "}
                      Listings
                    </div>

                    <div
                      className="
                      bg-green-50
                      text-green-700
                      px-6
                      py-3
                      rounded-full
                      font-semibold
                    "
                    >
                      Verified
                      Owner
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() =>
                        setEdit(
                          true
                        )
                      }
                      className="
                      mt-8
                      bg-blue-700
                      hover:bg-blue-800
                      text-white
                      px-8
                      py-4
                      rounded-[20px]
                      font-semibold
                      transition
                    "
                    >
                      Edit
                      Profile
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= ROOMS ================= */}
        <div>

          <div
            className="
            flex
            justify-between
            items-center
            flex-wrap
            gap-4
            mb-10
          "
          >
            <div>
              <h2
                className="
                text-4xl
                font-bold
                text-gray-900
              "
              >
                Listings by{" "}
                {
                  owner?.name
                }
              </h2>

              <p className="text-gray-500 mt-2">
                Explore rooms
                posted by this
                owner
              </p>
            </div>

            <div
              className="
              bg-white
              border
              rounded-full
              px-6
              py-3
              shadow-sm
              font-semibold
            "
            >
              {rooms.length}{" "}
              Rooms
            </div>
          </div>

          {/* ROOMS */}
          <div
            className="
            flex
            flex-wrap
            justify-center
            gap-8
          "
          >
            {rooms.length >
            0 ? (
              rooms.map(
                (
                  room
                ) => (
                  <RoomCard
                    key={
                      room._id
                    }
                    item={
                      room
                    }
                  />
                )
              )
            ) : (
              <div
                className="
                bg-white
                border
                rounded-[30px]
                shadow-sm
                p-14
                text-center
                w-full
              "
              >
                <h2 className="text-3xl font-bold text-gray-800">
                  No Rooms
                  Found
                </h2>

                <p className="text-gray-500 mt-4">
                  This owner
                  has not
                  posted any
                  rooms yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}