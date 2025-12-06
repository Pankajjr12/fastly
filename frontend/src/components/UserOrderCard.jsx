import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api.js";

function UserOrderCard({ data }) {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState({});

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
      const result = await axios.post(
        `${apiUrl}/api/item/rating`,
        { itemId, rating },
        { withCredentials: true }
      );
      setSelectedRating((prev) => ({
        ...prev,
        [itemId]: rating,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 space-y-5 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between border-b pb-3">
        <div>
          <p className="font-bold text-lg text-gray-800 tracking-wide">
            Order #{data._id.slice(-6)}
          </p>
          <p className="text-sm text-gray-500">{formatDate(data.createdAt)}</p>
        </div>

        <div className="text-right">
          {data.paymentMethod === "cod" ? (
            <p className="text-xs text-gray-600 border rounded-md px-2 py-1 inline-block">
              COD
            </p>
          ) : (
            <p className="text-xs text-gray-600 border rounded-md px-2 py-1 inline-block">
              Online: {data.payment ? "Paid" : "Failed"}
            </p>
          )}
          <p className="font-medium text-blue-600 mt-1">
            {data.shopOrders?.[0].status}
          </p>
        </div>
      </div>

      {/* Shop List */}
      {data.shopOrders.map((shopOrder, index) => (
        <div
          className="border rounded-xl p-4 bg-[#fff8f4] space-y-4 shadow-sm"
          key={index}
        >
          {/* Shop Name with animation */}
          <p className="text-lg font-semibold text-gray-900 animated-underline">
            {shopOrder.shop.name}
          </p>

          {/* Items */}
          <div className="flex space-x-4 overflow-x-auto scrollbar-thin pb-1">
            {shopOrder.shopOrderItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 border rounded-xl p-3 bg-white shadow hover:shadow-md transition duration-200"
              >
                <img
                  src={item.item.image}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg"
                />
                <p className="text-sm font-semibold mt-2 text-gray-800 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Qty: {item.quantity} × ₹{item.price}
                </p>

                {/* Rating */}
                {shopOrder.status === "delivered" && (
                  <div className="flex space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        className={`text-lg ${
                          selectedRating[item.item._id] >= star
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                        onClick={() => handleRating(item.item._id, star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Subtotal */}
          <div className="flex justify-between items-center border-t pt-3">
            <p className="font-semibold text-gray-700">
              Subtotal: ₹{shopOrder.subtotal}
            </p>
            <span className="text-sm font-semibold text-green-600">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      {/* Total + Button */}
      <div className="flex justify-between items-center border-t pt-4">
        <p className="font-bold text-lg text-gray-800">
          Total: ₹{data.totalAmount}
        </p>
        <button
          className="bg-gradient-to-r from-[#ff69b4] to-[#efbbcc] hover:opacity-90 text-white px-5 py-2 rounded-lg shadow-md text-sm font-semibold transition"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
}

export default UserOrderCard;
