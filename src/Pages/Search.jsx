import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import RoomCard from "../components/RoomCard";

export default function Search() {
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState(searchParams.get("city") || "");
  const [area, setArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch function
  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/listings`, {
        params: {
          category,
          city,
          area,
          minPrice,
          maxPrice,
        },
      });

      setListings(res.data);
    } catch (err) {
      res.send(err)
    }
    setLoading(false);
  };

  // ⭐ Initial load
  useEffect(() => {
    fetchListings();
  }, []);

  // ⭐ Smooth Debounce Search
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchListings();
    }, 400); // Smooth UX delay

    return () => clearTimeout(delay);
  }, [city, area, minPrice, maxPrice, category]);



  return (
    <div className="container mx-auto px-6 py-10">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Rooms</h1>

      {/* FILTER BAR */}
      <div className="bg-white shadow-sm border rounded-xl p-6 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Family">Family</option>
            <option value="PG">PG</option>
            <option value="Hostel">Hostel</option>
            <option value="Flat">Flat</option>
          </select>

          {/* City */}
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (Nagpur, Delhi, Pune...)"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Area */}
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area (Bansi Nagar, Hinjewadi...)"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Min Price */}
          <input
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
            type="number"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Max Price */}
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
            type="number"
            className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Button */}
          <button
            onClick={fetchListings}
            className="bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition p-3"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {loading ? (
        <Loader />
      ) : listings.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No rooms found. Try adjusting filters.
        </p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {Array.isArray(listings) &&
            listings.map((item) => (
              <RoomCard key={item._id} item={item} />
            ))}
        </div>
      )}
    </div>
  );
}
