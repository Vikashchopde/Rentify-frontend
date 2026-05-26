// src/pages/Listing.jsx

import React, {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

import axios from "axios";
import toast from "react-hot-toast";

import Loader from "../components/Loader";
import RoomCard from "../components/RoomCard";

import ReviewForm from "../components/ReviewUser/ReviewForm";
import ReviewList from "../components/ReviewUser/ReviewList";

import useAuth from "../context/AuthContext";

export default function Listing() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  // ================== STATE ==================
  const [listing, setListing] =
    useState(null);

  const [activeImage, setActiveImage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [related, setRelated] =
    useState([]);

  const [authError, setAuthError] =
    useState(false);

  // ================== USER ID ==================
  const userId =
    user?._id || user?.id;

  // ================== OWNER CHECK ==================
  const isOwner =
    user &&
    listing?.owner?._id?.toString() ===
      userId?.toString();

  // ================== REVIEW CHECK ==================
  const hasReviewed =
    user &&
    listing?.reviews?.some(
      (review) =>
        review.user?._id?.toString() ===
        userId?.toString()
    );

  // ================== CALL OWNER ==================
  const contactOwner = () => {

    if (!listing?.owner?.phone) {

      return toast.error(
        "Owner mobile number not available!"
      );
    }

    window.location.href =
      `tel:${listing.owner.phone}`;
  };

  // ================== FETCH LISTING ==================
  const fetchListing = async () => {

    try {

      setLoading(true);

      const res = await axios.get(
        `/api/listings/${id}`,
        {
          params: {
            viewer: userId,
          },

          withCredentials: true,
        }
      );

      setListing(
        res.data.listing
      );

      setRelated(
        res.data.relatedListings || []
      );

      setActiveImage(
        res.data.listing.images?.[0] || ""
      );

    } catch (err) {

      console.log(
        "FETCH LISTING ERROR:",
        err
      );

      if (
        err.response?.status === 401
      ) {

        setAuthError(true);

      } else {

        toast.error(
          "Failed to load listing"
        );
      }

    } finally {

      setLoading(false);
    }
  };

  // ================== FETCH ON LOAD ==================
  useEffect(() => {
    fetchListing();
  }, [id]);

  // ================== SCROLL TOP ==================
  useEffect(() => {

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }, [id]);

  // ================== RECENT VIEW ==================
  useEffect(() => {

    if (!listing?._id) return;

    let viewed =
      JSON.parse(
        localStorage.getItem(
          "recentViewed"
        )
      ) || [];

    viewed = viewed.filter(
      (room) =>
        room._id !== listing._id
    );

    viewed.unshift(listing);

    if (viewed.length > 6) {
      viewed = viewed.slice(0, 6);
    }

    localStorage.setItem(
      "recentViewed",
      JSON.stringify(viewed)
    );

  }, [listing]);

  // ================== START CHAT ==================
  // ================== START CHAT ==================
const startChat = async () => {
  if (!user) {
    return toast.error(
      "Please login to start chat ❤️"
    );
  }

  try {
    console.log(
      "CHAT PAYLOAD:",
      {
        userId,
        ownerId:
          listing?.owner?._id,
        listingId:
          listing?._id,
      }
    );

    const res =
      await axios.post(
        `/api/chat/start`,
        {
          userId,

          ownerId:
            listing?.owner?._id,

          listingId:
            listing?._id,
        },
        {
          withCredentials: true,
        }
      );

    console.log(
      "CHAT CREATED:",
      res.data
    );

    toast.success(
      "Chat started ❤️"
    );

    navigate(
      `/chat/${res.data._id}`
    );
  } catch (err) {
    console.log(
      "START CHAT ERROR:",
      err.response?.data ||
        err
    );

    toast.error(
      err.response?.data
        ?.error ||
        "Unable to start chat"
    );
  }
};

  // ================== LOADING ==================
  if (loading) {
    return <Loader />;
  }

  // ================== LOGIN REQUIRED ==================
  if (authError) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">

        <img
          src="https://cdn-icons-png.flaticon.com/512/565/565547.png"
          className="w-24 opacity-70 mb-4"
          alt="login"
        />

        <h2 className="text-2xl font-bold text-gray-800">
          Login Required
        </h2>

        <p className="text-gray-600 mt-2">
          Please sign-in to view room details ❤️
        </p>

        <Link
          to="/signin"
          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Go to Sign-In
        </Link>
      </div>
    );
  }

  // ================== LISTING NOT FOUND ==================
  if (!listing) {

    return (
      <p className="text-center text-gray-600 mt-20">
        Listing not found
      </p>
    );
  }

  // ================== MAP LOCATION ==================
  const locationForMap = `
    ${listing.area || ""}
    ${listing.city || ""}
    ${listing.address || ""}
  `;

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg">

        {/* ================= HERO IMAGE ================= */}
        <div className="w-full h-[260px] md:h-[330px] rounded-t-2xl overflow-hidden">

          {activeImage ? (

            <img
              src={activeImage}
              alt="Room"

              className="w-full h-full object-cover"
            />

          ) : (

            <div className="w-full h-full bg-gray-200 flex items-center justify-center">

              No image

            </div>
          )}
        </div>

        {/* ================= IMAGE GALLERY ================= */}
        <div className="flex gap-3 overflow-x-auto p-4 bg-white">

          {listing.images?.map(
            (img, index) => (

              <img
                key={index}

                src={img}

                alt={`thumb-${index}`}

                onClick={() =>
                  setActiveImage(img)
                }

                className={`w-24 h-16 rounded-xl object-cover cursor-pointer border ${
                  activeImage === img
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              />
            )
          )}
        </div>

        {/* ================= DETAILS ================= */}
        <div className="p-6 md:p-8">

          {/* TITLE */}
          <div className="flex flex-wrap justify-between items-center mb-4">

            <h1 className="text-2xl font-bold text-gray-900">
              {listing.title}
            </h1>

            <p className="text-gray-500 text-sm">
              👁 {listing.views} views
            </p>

            <p className="text-2xl font-bold text-blue-600">
              ₹{listing.price}
            </p>
          </div>

          {/* LOCATION */}
          <p className="text-gray-600 text-base">

            📍 {listing.city}

            {listing.area
              ? ` - ${listing.area}`
              : ""}
          </p>

          {/* CATEGORY */}
          <p className="text-gray-700 mt-2">

            <span className="font-semibold">
              {listing.category}
            </span>
          </p>

          {/* DESCRIPTION */}
          <p className="text-gray-700 leading-relaxed mt-3">

            {listing.description}

          </p>

          {/* ================= OWNER ================= */}
          <div className="mt-8 bg-gray-50 border rounded-2xl p-5 shadow-sm">

            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Owner Information
            </h2>

            <Link
              to={`/owner/${listing.owner._id}`}

              className="text-blue-600 underline underline-offset-2 hover:text-blue-800 hover:underline-offset-4 transition"
            >
              View Owner Profile
            </Link>

            <p className="text-gray-800 font-semibold mt-2">

              {listing.owner?.name}

            </p>

            <p className="text-gray-600">

              {listing.owner?.email}

            </p>

            <p className="text-gray-600 mt-1">

              📞
              <span className="font-semibold">
                {" "}
                {listing.owner?.phone}
              </span>

            </p>

            {/* ================= BUTTONS ================= */}
            <div className="mt-4 flex flex-col gap-3">

              {/* CALL */}
              <button
                onClick={contactOwner}

                className="bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
              >
                Call Owner
              </button>

              {/* CHAT */}
              <button
                onClick={startChat}

                className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Chat with Owner 💬
              </button>

              {/* WHATSAPP */}
              {listing.owner?.phone && (

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/${listing.owner.phone}`
                    )
                  }

                  className="bg-[#25D366] text-white py-2 rounded-xl hover:bg-[#1DA851] transition"
                >
                  WhatsApp Owner
                </button>
              )}
            </div>
          </div>

          {/* ================= AMENITIES ================= */}
          <div className="mt-8">

            <h2 className="text-lg font-semibold mb-2">
              Amenities
            </h2>

            <div className="flex flex-wrap gap-3">

              {listing.amenities?.length > 0 ? (

                listing.amenities.map(
                  (item, index) => (

                    <span
                      key={index}

                      className="px-3 py-1.5 bg-gray-100 border rounded-xl text-gray-700"
                    >
                      ✅ {item}
                    </span>
                  )
                )

              ) : (

                <p className="text-gray-600">
                  No amenities listed
                </p>
              )}
            </div>
          </div>

          {/* ================= ADDRESS ================= */}
          <div className="mt-8 mb-8">

            <h2 className="text-lg font-semibold mb-2">
              Address
            </h2>

            <p className="text-gray-700">
              {listing.address}
            </p>
          </div>

          {/* ================= MAP ================= */}
          <div className="mt-10">

            <h2 className="text-xl font-semibold mb-3">
              Location on Map
            </h2>

            {locationForMap.trim() ? (

              <iframe
                className="w-full h-64 rounded-xl border"

                loading="lazy"

                allowFullScreen

                referrerPolicy="no-referrer-when-downgrade"

                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  locationForMap
                )}&output=embed`}
              ></iframe>

            ) : (

              <p className="text-gray-600">
                Map location not available
              </p>
            )}
          </div>

          {/* ================= REVIEWS ================= */}
          <div className="mt-12">

            <h2 className="text-xl font-semibold mb-4">
              Reviews
            </h2>

            <ReviewList
              reviews={listing.reviews}

              listingId={listing._id}

              loggedUser={user}

              onSuccess={fetchListing}
            />

            {isOwner ? (

              <p className="text-red-500 font-semibold mt-4">

                ❌ Owners cannot review their own listing

              </p>

            ) : hasReviewed ? (

              <p className="text-green-600 font-semibold mt-4">

                ✔ You already reviewed this room ❤️

              </p>

            ) : (

              <ReviewForm
                listingId={listing._id}

                onSuccess={fetchListing}
              />
            )}
          </div>
        </div>
      </div>

      {/* ================= RELATED ================= */}
      <h2 className="text-xl font-semibold mt-10 mb-4">

        Related Rooms

      </h2>

      <div className="flex flex-wrap gap-5 mt-5">

        {related.length > 0 ? (

          related.map((item) => (

            <RoomCard
              key={item._id}
              item={item}
            />
          ))

        ) : (

          <div className="w-full flex flex-col items-center justify-center py-10 bg-white rounded-xl shadow">

            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"

              className="w-20 opacity-70 mb-3"

              alt="not-found"
            />

            <p className="text-gray-700 font-semibold text-lg">

              No related rooms found

            </p>

            <p className="text-gray-500 text-sm mt-1">

              Try exploring rooms in nearby areas ✨

            </p>
          </div>
        )}
      </div>
    </div>
  );
}