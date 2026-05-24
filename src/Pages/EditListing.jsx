import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/listings/${id}`, { withCredentials: true })
      .then(res => {
        setTitle(res.data.listing.title);
        setCity(res.data.listing.city);
        setPrice(res.data.listing.price);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("price", price);
    images.forEach(img => formData.append("images", img));

    try {
      await axios.put(`http://localhost:5000/api/listings/${id}`, formData, {
        withCredentials: true
      });

      toast.success("Updated!");
      navigate("/owner");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8"
  >
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Edit Listing</h2>
      <p className="text-gray-500 mt-1">
        Update your room details and keep your listing fresh.
      </p>
    </div>
  
    {/* TITLE */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Title
      </label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Cozy Room near Metro"
        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    {/* CITY */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        City
      </label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Mumbai, Pune..."
        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    {/* PRICE */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Monthly Price (₹)
      </label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="5000"
        className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  
    {/* IMAGES */}
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Update Photos
      </label>
  
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
          className="hidden"
          id="imageUpload"
        />
  
        <label
          htmlFor="imageUpload"
          className="cursor-pointer flex flex-col items-center justify-center gap-2"
        >
          <span className="text-3xl">📷</span>
          <p className="text-gray-600">
            Click to upload new images
          </p>
          <p className="text-sm text-gray-400">
            PNG, JPG up to 10 images
          </p>
        </label>
      </div>
    </div>
  
    {/* ACTIONS */}
    <div className="flex gap-4 pt-4">
      <button
        type="submit"
        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
      >
        Save Changes
      </button>
  
      <button
        type="button"
        onClick={() => window.history.back()}
        className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
      >
        Cancel
      </button>
    </div>
  </form>
  
  );
}
