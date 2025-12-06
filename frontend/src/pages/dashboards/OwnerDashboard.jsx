import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "../../components/OwnerItemCard";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const colors = ["#ff4d2d", "#ff914d", "#ffb347", "#ff6f61", "#ff3c00"];
  const [currentColor, setCurrentColor] = useState(colors[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prevColor) => {
        const nextIndex = (colors.indexOf(prevColor) + 1) % colors.length;
        return colors[nextIndex];
      });
    }, 3000); // ⏱️ change every 3 seconds

    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen flex flex-col items-center overflow-x-hidden pt-[80px]">
      {" "}
      <Navbar />
      {!myShopData && (
        <div className="w-full flex justify-center items-center mt-10 p-3 text-gray-600">
          <div
            className="w-full max-w-md bg-white shadow-lg  rounded-2xl p-6 border
           border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <FaUtensils
                size={24}
                className="text-[#ff4d2d] cursor-pointer w-16 h-16 sm:w-20 sm:h-20 mb-4"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                From your kitchen to their cravings. Where hungry meets happy
                and you make it happen.
              </p>
              <button
                className="bg-[#ff69b4] text-white px-5 sm:px-6 py-2 rounded-full font-medium 
              shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 
             text-center text-gray-800 font-semibold"
          >
            <FaUtensils className="text-[#ff69b4] w-10 h-10 sm:w-14 sm:h-14 mb-2 sm:mb-0" />
            <span className="text-2xl sm:text-3xl font-bold">
              Welcome to{" "}
              <span
                style={{
                  color: currentColor,
                  transition: "color 1s ease-in-out",
                }}
              >
                {myShopData.name}
              </span>
            </span>
          </h1>

          <div
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl 
          transition-all duration-300 w-full max-w-3xl relative "
          >
            <div
              className="absolute top-4 right-4 bg-[#ff69b4] text-white p-2 rounded-full shadow-md
             hover:bg-orange-600 transition-colors cursor-pointer "
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen />
            </div>
            <img
              src={myShopData.image}
              alt="image"
              className="w-full h-48 sm:h-64 object-cover"
            />

            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                {myShopData.name}
              </h1>
              <p className="text-gray-500">
                {myShopData.city},{myShopData.state}
              </p>
              <p className="text-gray-500 mb-4">{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length == 0 && (
            <div className="w-full flex justify-center items-center mt-10 p-3 text-gray-600">
              <div
                className="w-full max-w-md bg-white shadow-lg  rounded-2xl p-6 border
           border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col items-center text-center">
                  <FaUtensils
                    size={24}
                    className="text-[#ff69b4] cursor-pointer w-16 h-16 sm:w-20 sm:h-20 mb-4"
                  />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Add Your Food Item
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Showcase your best dishes and let customers discover the
                    flavors that make your shop special.
                  </p>
                  <button
                    className="bg-[#ff69b4] text-white px-5 sm:px-6 py-2 rounded-full font-medium 
              shadow-md hover:bg-orange-600 transition-colors duration-200"
                    onClick={() => navigate("/add-item")}
                  >
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          )}
          {myShopData.items.length > 0 && (
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={index} />
              ))}
            </div>
          )}
        </div>
      )}
  
    </div>
  );
};

export default OwnerDashboard;
