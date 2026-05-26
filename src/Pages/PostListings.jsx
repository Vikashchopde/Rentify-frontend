import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function PostListing() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [preview, setPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔥 Loader state

  // IMAGE HANDLER
  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  // VIDEO HANDLER
  const handleVideo = (e) => {
    setVideo(e.target.files[0]);
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !city || !price || !description) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      setIsSubmitting(true); // 🔥 START LOADING

      const formData = new FormData();
      formData.append("category", category);
      formData.append("title", title);
      formData.append("city", city);
      formData.append("area", area);
      formData.append("address", address);
      formData.append("price", price);
      formData.append("description", description);
      formData.append(
        "amenities",
        JSON.stringify(amenities.split(",").map((a) => a.trim()))
      );

      images.forEach((img) => formData.append("images", img));
      if (video) formData.append("video", video);

      await axios.post(
        `/api/listings`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      toast.success("Listing posted successfully!");

      // Reset form
      setCategory("");
      setTitle("");
      setCity("");
      setArea("");
      setAddress("");
      setPrice("");
      setDescription("");
      setAmenities("");
      setImages([]);
      setVideo(null);
      setPreview([]);

    } catch (err) {
      toast.error("Error Creating Listing!");
    } finally {
      setIsSubmitting(false); // 🔥 STOP LOADING
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Post a New Listing
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm border rounded-xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto"
      >
        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border w-full p-3 rounded-lg"
          required
        >
          <option value="">Select Category</option>
          <option value="Boys">Boys</option>
          <option value="Girls">Girls</option>
          <option value="Family">Family</option>
          <option value="PG">PG</option>
          <option value="Hostel">Hostel</option>
          <option value="Flat">Flat</option>
        </select>

        {/* TITLE */}
        <div>
          <label className="block font-semibold mb-1">Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border w-full p-3 rounded-lg"
            required
          />
        </div>

        {/* CITY */}
        <div>
          <label className="block font-semibold mb-1">City *</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border w-full p-3 rounded-lg"
            required
          />
        </div>

        {/* AREA */}
        <div>
          <label className="block font-semibold mb-1">Area</label>
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border w-full p-3 rounded-lg"
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="block font-semibold mb-1">Address *</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border w-full p-3 rounded-lg"
            required
          />
        </div>

        {/* PRICE */}
        <div>
          <label className="block font-semibold mb-1">Price (₹) *</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border w-full p-3 rounded-lg"
            required
          />
        </div>

        {/* AMENITIES */}
        <div>
          <label className="block font-semibold mb-1">Amenities</label>
          <input
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            className="border w-full p-3 rounded-lg"
            placeholder="WiFi, AC, Parking"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block font-semibold mb-1">Description *</label>
          <textarea
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border w-full p-3 rounded-lg"
            required
          />
        </div>

        {/* IMAGES */}
        <div>
          <label className="block font-semibold mb-1">Upload Images *</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImages}
            className="border w-full p-3 rounded-lg"
            required
          />

          {preview.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {preview.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  className="w-24 h-24 object-cover rounded-lg border"
                  alt="preview"
                />
              ))}
            </div>
          )}
        </div>

        {/* VIDEO */}
        <div>
          <label className="block font-semibold mb-1">
            Upload Video (optional)
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideo}
            className="border w-full p-3 rounded-lg"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition ${
            isSubmitting
              ? "opacity-70 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Posting Listing...
            </>
          ) : (
            "Post Listing"
          )}
        </button>
      </form>
    </div>
  );
}
