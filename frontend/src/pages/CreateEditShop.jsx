import React, { useRef, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { apiUrl } from "../config/api";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { myShopData } = useSelector((state) => state.owner || {});
  const { currentCity, currentState, currentAddress } = useSelector(
    (state) => state.user || {}
  );

  const [name, setName] = useState(myShopData?.name || "");
  const [address, setAddress] = useState(
    myShopData?.address || currentAddress || ""
  );
  const [city, setCity] = useState(myShopData?.city || currentCity || "");
  const [state, setState] = useState(myShopData?.state || currentState || "");

  const [frontImage, setFrontImage] = useState(myShopData?.image || null);
  const [backImage, setBackImage] = useState(null);
  const [loading,setLoading] = useState(false)

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackImage(file);
    setFrontImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("address", address);
      if (backImage) {
        formData.append("image", backImage);
      }
      const result = await axios.post(
        `${apiUrl}/api/shop/create-edit`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
      setLoading(false);
      console.log(result.data);
      navigate("/")
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
        className="absolute top-6 left-8 sm:top-8 sm:left-8 flex items-center gap-2
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
          <h1 className="text-2xl font-extrabold text-gray-800">
            {myShopData ? "Edit Your Shop" : "Register Your Shop"}
          </h1>
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
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              placeholder="e.g. Spice & Bite Restaurant"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff69b4] transition"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Shop Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Shop Image
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

          {/* State & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                placeholder="e.g. Maharashtra"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff69b4] transition"
                onChange={(e) => setState(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={city}
                placeholder="e.g. Mumbai"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 
                  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff69b4] transition"
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              placeholder="e.g. 24, Hill Road, Bandra West"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff69b4] transition"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#ff69b4] text-white px-5 py-2.5 rounded-full font-semibold 
              shadow-md hover:bg-orange-600 active:scale-[0.98] transition-all duration-150" disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
