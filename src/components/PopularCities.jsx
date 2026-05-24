import React from "react";
import { useNavigate } from "react-router-dom";

export default function PopularCities() {
  const navigate = useNavigate();

  const cities = [
    {
      name: "Nagpur",
      img: "/cities/nagpur.jpg",
    },
    {
      name: "Hyderabad",
      img: "/cities/hydrabad.jpg",
    },
    {
      name: "Pune",
      img: "/cities/pune.jpg",
    },
    {
      name: "Mumbai",
      img: "/cities/mumbai.jpg",
    },
    {
      name: "Delhi",
      img: "/cities/delhi.jpg",
    },
    {
      name: "Bangalore",
      img: "/cities/bangalore.jpg",
    },
  ];

  return (
    <div className="w-full">

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-10">

        <div>
          <h2 className="text-4xl font-bold text-gray-900">
            Popular Cities
          </h2>

          <p className="text-gray-500 mt-2">
            Explore rentals across
            top cities in India
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/search")
          }
          className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-800 transition"
        >
          Explore All
        </button>
      </div>

      {/* ================= CITY CARDS ================= */}
      <div className="flex flex-wrap justify-center gap-8">

        {cities.map(
          (city, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(
                  `/search?city=${city.name}`
                )
              }
              className="relative overflow-hidden rounded-[28px] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border bg-white w-[350px] h-[230px] group"
            >

              {/* IMAGE */}
              <img
                src={city.img}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/35"></div>

              {/* GRADIENT */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

              {/* TEXT */}
              <div className="absolute bottom-5 left-5 text-white">

                <h3 className="text-2xl font-bold drop-shadow-lg">
                  {city.name}
                </h3>

                <p className="text-sm text-gray-200 mt-1">
                  Explore rental rooms
                </p>
              </div>

              {/* BADGE */}
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                Popular
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}