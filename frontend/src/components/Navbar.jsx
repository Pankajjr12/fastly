import React, { useEffect, useState } from "react";
import { FaLocationDot, FaCartShopping } from "react-icons/fa6";
import { FaSearch, FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoReceiptSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { apiUrl } from "../config/api";
import { setSearchItems, setUserData } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Always safely destructure state slices
  const {
    userData = {},
    currentCity = "",
    cartItems,
  } = useSelector((state) => state.user || {});
  const { myShopData } = useSelector((state) => state.owner || {});

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const handleLogout = async () => {
    try {
      await axios.get(`${apiUrl}/api/auth/signout`, { withCredentials: true });
      dispatch(setUserData(null));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const role = userData?.role;

  const handleSearchItems = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/api/item/search-items?query=${query}&city=${currentCity}`,
        { withCredentials: true }
      );
      dispatch(setSearchItems(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (query) {
      handleSearchItems();
    } else {
      dispatch(setSearchItems(null));
    }
  }, [query]);

  return (
    <div
      className="w-full h-[80px] flex items-center justify-between md:justify-center gap-4 md:gap-8 px-4 md:px-8 fixed top-0 z-[9999] font-sans"
      style={{ backgroundColor: "var(--bg-color)" }}
    >
      {/* Mobile search bar */}
      {showSearch && role === "user" && (
        <div className="fixed top-[80px] left-1/2 -translate-x-1/2 w-[92%] md:w-[75%] bg-white shadow-lg rounded-xl flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4 p-3 md:p-0 text-sm md:text-base font-medium">
          <div className="flex items-center w-full md:w-[30%] gap-2 md:px-4 border-b md:border-b-0 md:border-r border-gray-200 pb-2 md:pb-0">
            <FaLocationDot size={20} className="text-gray-600" />
            <div className="truncate text-gray-600">
              {currentCity || "Detecting..."}
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-[70%]">
            <FaSearch size={20} className="text-gray-600" />
            <input
              type="text"
              placeholder="Search delicious food here..."
              className="flex-1 px-3 py-2 md:py-3 text-gray-700 bg-gray-50 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none placeholder:text-gray-400"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1
        className="text-2xl md:text-3xl font-extrabold tracking-tight select-none"
        style={{ color: "var(--text-color)" }}
      >
        Fastly
      </h1>

      {/* Desktop search bar */}
      {role === "user" && (
        <div className="hidden md:flex w-[45%] lg:w-[40%] h-[70px] bg-white shadow-md rounded-lg items-center gap-4 px-4 text-sm md:text-base">
          <div className="flex items-center w-[35%] gap-2 px-2 border-r border-gray-300 text-gray-600">
            <FaLocationDot size={18} className="text-gray-500" />
            <span className="truncate">{currentCity || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2 w-[65%]">
            <FaSearch size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search food..."
              className="w-full px-2 py-1 text-gray-700 bg-gray-50 rounded-md outline-none placeholder:text-gray-400"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Search toggle (mobile only) */}
        {role === "user" &&
          (showSearch ? (
            <RxCross2
              size={22}
              className="md:hidden text-[#ff69b4] cursor-pointer"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <FaSearch
              size={20}
              className="md:hidden text-gray-700 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* Owner buttons */}
        {role === "owner" ? (
          <>
            {myShopData && (
              <>
                <button
                  className="hidden md:flex items-center gap-2 p-2 rounded-lg bg-[#ff69b4]/10 text-sm md:text-base font-medium text-[#ff69b4]"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus />
                  <span>Add Food Item</span>
                </button>

                <button
                  className="md:hidden flex items-center p-2 rounded-lg bg-[#ff69b4]/10 text-[#ff69b4]"
                  onClick={() => navigate("/add-item")}
                >
                  <FaPlus size={16} />
                </button>
              </>
            )}

            <div className="relative flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-[#ff69b4]/10 text-[#ff69b4] font-medium text-sm md:text-base" onClick={() => navigate("/my-orders")}>
              <IoReceiptSharp />
              <span
                className="hidden md:inline"
                
              >
                My Orders
              </span>
              <span className="absolute -right-2 -top-2 text-[10px] font-bold text-white bg-[#ff69b4] rounded-full px-[6px] py-[2px]">
                0
              </span>
            </div>
          </>
        ) : (
          <>
            {userData.role == "user" && (
              <div
                className="relative cursor-pointer"
                onClick={() => navigate("/cart")}
              >
                <FaCartShopping size={20} className="text-gray-700" />
                <span className="absolute right-[-8px] top-[-10px] text-xs text-gray-700">
                  {cartItems.length}
                </span>
              </div>
            )}
            <button
              className="hidden md:block text-sm md:text-base font-medium p-2 rounded-lg bg-[#ff69b4]/10"
              style={{ color: "var(--text-color)" }}
              onClick={() => navigate("/my-orders")}
            >
              My Orders
            </button>
          </>
        )}

        {/* User avatar */}
        <div
          className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center bg-[#ff69b4] text-white font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.fullName ? userData.fullName[0].toUpperCase() : "?"}
        </div>

        {/* Profile dropdown */}
        {showInfo && (
          <div
            className={`fixed top-[80px] right-[10px] 
            ${
              userData.role == "deliveryBoy"
                ? "md:right-[20%] lg:right-[40%]"
                : "md:right-[10%] lg:right-[25%]"
            } w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}
          >
            <div className="font-semibold text-gray-800">
              {userData?.fullName || "Guest"}
            </div>
            {userData.role == "user" && (
              <div
                className="md:hidden cursor-pointer text-gray-600 hover:text-[#ff69b4] transition-colors"
                onClick={() => navigate("/my-orders")}
              >
                My Orders
              </div>
            )}
            <div
              className="cursor-pointer text-gray-600 hover:text-[#ff69b4] transition-colors"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
