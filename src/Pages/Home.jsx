import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import RoomCard from "../components/RoomCard";
import PopularCities from "../components/PopularCities.jsx";
import axios from "axios";
import useAuth from "../context/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // ================= FETCH LATEST =================
  const fetchLatest = async () => {
    try {
      const res = await axios.get(
        `/api/listings?limit=6`
      );

      console.log(res.data);

      setListings(res.data?.listings || res.data || []);
    } catch (err) {
      console.error(
        "Error fetching latest listings:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  // ================= SEARCH =================
  const handleSearch = () => {
    if (city.trim()) {
      navigate(
        `/search?city=${city}`
      );
    }
  };

  return (
    <div className="w-full bg-[#F8FAFC]">

      {/* ================= HERO ================= */}
      <section className="bg-gradient-to-b from-[#EFF6FF] to-[#F8FAFC] px-6 py-20 md:py-28">

        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-10">

          {/* LEFT */}
          <div className="flex-1 min-w-[300px]">

            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
              Trusted Rental Platform
            </span>

            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mt-6 leading-tight">
              Find Your Perfect
              <span className="text-blue-700">
                {" "}Rental Room
              </span>
            </h1>

            <p className="text-gray-600 mt-6 text-lg max-w-2xl">
              Discover verified rooms,
              trusted owners and rental
              spaces across cities with
              secure communication and
              fast search.
            </p>

            {/* SEARCH */}
            <div className="mt-10 flex flex-wrap shadow-lg rounded-2xl overflow-hidden bg-white border border-gray-200">

              <input
                type="text"
                value={city}
                placeholder="Search by city..."
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleSearch()
                }
                className="flex-1 px-6 py-5 outline-none min-w-[220px]"
              />

              <button
                onClick={
                  handleSearch
                }
                className="bg-blue-700 hover:bg-blue-800 text-white px-10 py-5 font-semibold transition"
              >
                Search
              </button>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-6 mt-10">

              <div className="bg-white border shadow-sm rounded-2xl p-5 w-[180px] h-[110px] flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-blue-700">
                  500+
                </h2>
                <p className="text-gray-600 text-sm">
                  Verified Rooms
                </p>
              </div>

              <div className="bg-white border shadow-sm rounded-2xl p-5 w-[180px] h-[110px] flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-blue-700">
                  50+
                </h2>
                <p className="text-gray-600 text-sm">
                  Cities Covered
                </p>
              </div>

              <div className="bg-white border shadow-sm rounded-2xl p-5 w-[180px] h-[110px] flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-blue-700">
                  1000+
                </h2>
                <p className="text-gray-600 text-sm">
                  Happy Renters
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex-1 min-w-[300px] flex justify-center">

            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
              alt="room"
              className="rounded-[30px] shadow-2xl object-cover h-[450px] w-full max-w-[520px]"
            />
          </div>
        </div>
      </section>

      {/* ================= LATEST LISTINGS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="flex justify-between items-center mb-10 flex-wrap gap-4">

          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              Latest Listings
            </h2>

            <p className="text-gray-500 mt-2">
              Explore newly added rental rooms
            </p>
          </div>

          <Link
            to="/search"
            className="text-blue-700 font-semibold hover:underline"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : listings.length ===
          0 ? (
          <p className="text-gray-500">
            No listings available
          </p>
        ) : (
          <div className="flex flex-wrap gap-8 justify-center">
            {Array.isArray(listings) &&
              listings.map((item) => (
                <RoomCard
                  key={item._id}
                  item={item}
                />
              )
              )}
          </div>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-wrap justify-center gap-8">

          {[
            {
              title:
                "Post Your Listing",
              desc:
                "Add your rental room and connect with genuine renters.",
              icon:
                "🏠",
            },

            {
              title:
                "Explore Cities",
              desc:
                "Find rooms across popular cities with verified listings.",
              icon:
                "📍",
            },

            {
              title:
                "Secure Chat",
              desc:
                "Connect with owners directly using secure messaging.",
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
                className="bg-white border rounded-[28px] shadow-sm hover:shadow-xl transition-all duration-300 w-[360px] h-[230px] p-8 flex flex-col justify-center items-center text-center"
              >
                <span className="text-5xl">
                  {
                    item.icon
                  }
                </span>

                <h3 className="font-bold text-2xl mt-4">
                  {
                    item.title
                  }
                </h3>

                <p className="text-gray-600 mt-4">
                  {
                    item.desc
                  }
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">

        <h2 className="text-4xl font-bold text-center text-gray-900 mb-14">
          How It Works
        </h2>

        <div className="flex flex-wrap justify-center gap-8">

          {[
            "Search Rooms",
            "Chat With Owner",
            "Move In",
          ].map(
            (
              title,
              index
            ) => (
              <div
                key={index}
                className="bg-white border rounded-[28px] shadow-sm hover:shadow-xl transition w-[360px] h-[240px] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="bg-blue-700 text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-5">
                  {index + 1}
                </div>

                <h3 className="font-bold text-2xl">
                  {title}
                </h3>

                <p className="text-gray-600 mt-3">
                  Easy process to
                  rent rooms quickly
                  and safely.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= CTA ================= */}
      {user?.role ===
        "owner" && (
          <section className="max-w-7xl mx-auto px-6 py-10">

            <div className="bg-blue-700 rounded-[30px] p-12 text-white flex flex-wrap justify-between items-center gap-6">

              <div>
                <h2 className="text-4xl font-bold">
                  Post Your Property
                </h2>

                <p className="text-blue-100 mt-4">
                  Reach thousands of
                  renters instantly.
                </p>
              </div>

              <Link
                to="/post"
                className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition"
              >
                Post Listing
              </Link>
            </div>
          </section>
        )}

      {/* ================= CITIES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <PopularCities />
      </section>

    </div>
  );
}