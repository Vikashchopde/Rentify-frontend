import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";
import {
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../context/AuthContext";

export default function UserProfile() {
  const {
    user,
    setUser,
  } = useAuth();

  const userId =
    user?.id ||
    user?._id;

  const [
    form,
    setForm,
  ] = useState({
    name: "",
    phone: "",
    profileImage:
      "",
  });

  const [
    loading,
    setLoading,
  ] = useState(
    true
  );

  const [
    saving,
    setSaving,
  ] = useState(
    false
  );

  // ================= AUTH =================
  if (!user) {
    return (
      <Navigate to="/signin" />
    );
  }

  // ================= LOAD PROFILE =================
  useEffect(() => {
    if (!userId)
      return;

    axios
      .get(
        `/api/profile/${userId}`
      )
      .then(
        (res) => {
          setForm({
            name:
              res.data
                .name ??
              "",

            phone:
              res.data
                .phone ??
              "",

            profileImage:
              res.data
                .profileImage ??
              "",
          });
        }
      )
      .catch(() =>
        toast.error(
          "Failed to load profile"
        )
      )
      .finally(() =>
        setLoading(
          false
        )
      );
  }, [userId]);

  // ================= INPUT =================
  const handleChange =
    (e) => {
      setForm(
        (
          prev
        ) => ({
          ...prev,
          [
            e.target
              .name
          ]:
            e.target
              .value,
        })
      );
    };

  // ================= IMAGE =================
  const handleImageChange =
    (e) => {
      const file =
        e.target
          ?.files?.[0];

      if (!file)
        return;

      const reader =
        new FileReader();

      reader.onloadend =
        () => {
          setForm(
            (
              prev
            ) => ({
              ...prev,
              profileImage:
                reader.result,
            })
          );
        };

      reader.readAsDataURL(
        file
      );
    };

  // ================= SAVE =================
  const handleSave =
    async () => {
      if (!userId) {
        return toast.error(
          "User not found"
        );
      }

      try {
        setSaving(
          true
        );

        const res =
          await axios.put(
            `/api/profile/${userId}`,
            form
          );

        const updatedUser =
          {
            ...user,

            id:
              user?.id ||
              user?._id,

            name:
              res
                .data
                .user
                .name,

            phone:
              res
                .data
                .user
                .phone,

            profileImage:
              res
                .data
                .user
                .profileImage,
          };

        // update navbar instantly
        setUser(
          updatedUser
        );

        localStorage.setItem(
          "user",
          JSON.stringify(
            updatedUser
          )
        );

        toast.success(
          "Profile updated ❤️"
        );
      } catch {
        toast.error(
          "Failed to update profile"
        );
      } finally {
        setSaving(
          false
        );
      }
    };

  if (loading) {
    return (
      <PageLoader />
    );
  }

  return (
    <div
      className="
      min-h-screen
      bg-[#F8FAFC]
      px-6
      py-12
    "
    >
      <div className="max-w-5xl mx-auto">

        {/* ================= PROFILE CARD ================= */}
        <div
          className="
          bg-white
          rounded-[36px]
          shadow-sm
          border
          border-gray-200
          overflow-hidden
        "
        >

          {/* TOP BANNER */}
          <div
            className="
            h-[180px]
            bg-gradient-to-r
            from-blue-700
            to-blue-500
          "
          ></div>

          {/* CONTENT */}
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

              {/* PROFILE IMAGE */}
              <div className="relative">

                <img
                  src={
                    form.profileImage ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="profile"
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

                <label
                  className="
                  absolute
                  bottom-2
                  right-2
                  w-12
                  h-12
                  rounded-full
                  bg-blue-700
                  text-white
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  shadow-lg
                  hover:bg-blue-800
                  transition
                "
                >
                  ✏️

                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleImageChange
                    }
                  />
                </label>
              </div>

              {/* INFO */}
              <div className="flex-1">

                <h1
                  className="
                  text-4xl
                  font-extrabold
                  text-gray-900
                "
                >
                  My Profile
                </h1>

                <p className="text-white mt-2 text-lg">
                  Update your
                  account details
                  and profile
                  information.
                </p>

                {/* FORM */}
                <div className="mt-10 flex flex-col gap-6">

                  <div>
                    <label
                      className="
                      block
                      text-gray-700
                      font-semibold
                      mb-2
                    "
                    >
                      Full Name
                    </label>

                    <input
                      name="name"
                      value={
                        form.name
                      }
                      onChange={
                        handleChange
                      }
                      className="
                      w-full
                      border
                      border-gray-300
                      rounded-[20px]
                      px-5
                      py-4
                      outline-none
                      focus:border-blue-600
                    "
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label
                      className="
                      block
                      text-gray-700
                      font-semibold
                      mb-2
                    "
                    >
                      Phone
                    </label>

                    <input
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      className="
                      w-full
                      border
                      border-gray-300
                      rounded-[20px]
                      px-5
                      py-4
                      outline-none
                      focus:border-blue-600
                    "
                      placeholder="Enter phone number"
                    />
                  </div>

                  <button
                    onClick={
                      handleSave
                    }
                    disabled={
                      saving
                    }
                    className="
                    mt-3
                    bg-blue-700
                    hover:bg-blue-800
                    text-white
                    py-4
                    rounded-[22px]
                    text-lg
                    font-semibold
                    transition
                    disabled:opacity-60
                  "
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= LOADER ================= */

function PageLoader() {
  return (
    <div
      className="
      min-h-screen
      flex
      justify-center
      items-center
      bg-[#F8FAFC]
    "
    >
      <div
        className="
        w-14
        h-14
        border-[5px]
        border-blue-600
        border-t-transparent
        rounded-full
        animate-spin
      "
      />
    </div>
  );
}