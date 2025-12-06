import React, { useState } from "react";
import veg from "../assets/veg.png";
import { useDispatch, useSelector } from "react-redux";
import nonveg from "../assets/onveg.png"; // fixed filename typo from "onveg.png"
import { FaStar, FaRegStar } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { addToCart } from "../redux/userSlice.js";

const FoodCard = ({ data }) => {
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.user);
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-yellow-500 text-lg" />
        ) : (
          <FaRegStar key={i} className="text-yellow-500 text-lg" />
        )
      );
    }
    return stars;
  };
  

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="w-[250px] rounded-2xl border-2 border-[#ff69b4] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType == "veg" ? (
            <img src={veg} className="w-4 h-4" />
          ) : (
            <img src={nonveg} className="w-4 h-4" />
          )}
        </div>

        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>

        <div className="flex items-center gap-1 mt-1">
          {renderStars(data.rating?.average || 0)}
          <span className="text-xs text-gray-500">
            {data.rating?.count || 0}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto p-3 gap-2">
        <span className="font-bold text-gray-900 text-lg">₹{data.price}</span>

        {/* Quantity + Cart Button */}
        <div className="flex items-center gap-2">
          {/* Quantity Box */}
          <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm px-3 py-1">
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition"
              onClick={handleDecrease}
            >
              <FaMinus size={12} className="text-gray-700" />
            </button>

            <span className="mx-3 text-gray-900 font-medium min-w-[20px] text-center">
              {quantity}
            </span>

            <button
              className="p-1 rounded-full hover:bg-gray-100 transition"
              onClick={handleIncrease}
            >
              <FaPlus size={12} className="text-gray-700" />
            </button>
            <button
            className={`${
              cartItems.some((i) => i.id == data._id)
                ? "bg-gray-800"
                : "bg-[#ff69b4]"
            } text-white px-3 py-2 transition-colors rounded-full`}
            onClick={() => {
              quantity > 0
                ? dispatch(
                    addToCart({
                      id: data._id,
                      name: data.name,
                      price: data.price,
                      image: data.image,
                      shop: data.shop,
                      quantity,
                      foodType: data.foodType,
                    })
                  )
                : null;
            }}
          >
            <FaCartShopping size={16} />
          </button>
          </div>

          {/* Cart Add Button */}
         
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
