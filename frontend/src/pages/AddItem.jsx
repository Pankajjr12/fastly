import React, { useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { apiUrl } from "../config/api";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner || {});

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const [frontImage, setFrontImage] = useState();
  const [backImage, setBackImage] = useState(null);
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [loading, setLoading] = useState(false);
  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackImage(file);
    setFrontImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);

      if (backImage) {
        formData.append("image", backImage);
      }
      const result = await axios.post(`${apiUrl}/api/item/add-item`, formData, {
        withCredentials: true,
      });
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
      console.log(result.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative p-6">
      {/* Back button */}
      {/* Back Button - modern positioned top-left */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-7 left-7 sm:top-8 sm:left-8 flex items-center gap-2
    bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm
    text-[#ff69b4] font-medium border border-orange-100
    hover:bg-[#ff69b4] hover:text-white transition-all duration-300"
      >
        <IoMdArrowBack size={20} />
        <span className="hidden sm:inline">Back</span>
      </button>

      {/* Card */}
      <div className="max-w-lg w-full bg-white shadow-lg rounded-2xl p-8 border border-orange-100">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 shadow-sm">
            <FaUtensils className="text-[#ff69b4] w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-800">Add Item</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Fill in your shop details below to start reaching more hungry
            customers.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Food Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g. pizza , burger"
              className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 text-gray-800 
        bg-white shadow-sm transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#ff69b4] focus:border-transparent hover:border-[#ff69b4]"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={price}
              placeholder="e.g. Rs 145.50"
              className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 text-gray-800 
        bg-white shadow-sm transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#ff69b4] focus:border-transparent hover:border-[#ff69b4]"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 text-gray-800 
        bg-white shadow-sm transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#ff69b4] focus:border-transparent hover:border-[#ff69b4]"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((cat, index) => (
                  <option value={cat} key={index}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Dropdown Arrow Icon */}
              <svg
                className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 text-gray-800 
        bg-white shadow-sm transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#ff69b4] focus:border-transparent hover:border-[#ff69b4]"
                onChange={(e) => setFoodType(e.target.value)}
              >
                <option value="">Select food type</option>

                <option value="veg">veg</option>
                <option value="non veg">non Veg</option>
              </select>

              {/* Dropdown Arrow Icon */}
              <svg
                className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Shop Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Food Image
            </label>
            <input
              type="file"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-700 focus:outline-none 
                focus:ring-2 focus:ring-[#ff69b4] transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
                file:text-sm file:font-medium file:bg-[#ff69b4]/10 file:text-[#ff69b4] hover:file:bg-[#ff69b4]/20"
              onChange={handleImage}
            />

            {frontImage && (
              <div className="mt-4">
                <img
                  src={frontImage}
                  alt="shop-image"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ff69b4] text-white px-5 py-2.5 rounded-full font-semibold 
              shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all duration-150"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
