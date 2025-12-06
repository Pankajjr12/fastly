import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../config/api";
import { IoMdArrowBack } from "react-icons/io";
import { FaStore } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUtensils } from "react-icons/fa";
import FoodCard from "../components/FoodCard";

const Shop = () => {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState([]);
  const navigate = useNavigate();

  const handleShop = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/api/item/get-by-shop/${shopId}`,
        { withCredentials: true }
      );
      setShop(result.data.shop);
      setItems(result.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleShop();
  }, [shopId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-100 relative overflow-hidden">
      
      {/* COOL FLOATING BLURRY SHAPES */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-300 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-0 w-48 h-48 bg-red-300 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 w-56 h-56 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>

      <button
        className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-full shadow-md transition"
        onClick={() => navigate("/")}
      >
        <IoMdArrowBack />
        <span>Back</span>
      </button>

      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img src={shop.image} alt="" className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 flex flex-col justify-center items-center text-center px-4">
            <FaStore className="text-white text-4xl mb-3 drop-shadow-md" />

            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>

            <div className="flex items-center gap-2 mt-2 max-w-[90%] mx-auto flex-wrap justify-center text-center sm:justify-start sm:text-left">
              <FaLocationDot size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-base sm:text-lg font-medium text-gray-200 leading-snug">
                {shop.address}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10 text-gray-800">
          <FaUtensils color="red" /> Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item) => (
              <FoodCard key={item._id} data={item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No Items Available</p>
        )}
      </div>
    </div>
  );
};

export default Shop;
