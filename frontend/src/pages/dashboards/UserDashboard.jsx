import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import { categories } from "../../category";
import CategoryCard from "../../components/CategoryCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "../../components/FoodCard";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { currentCity, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();
  const foodScrollRef = useRef();

  const navigate = useNavigate();

  const [showLeftCateButton, setShowLeftCateButton] = useState(false);
  const [showRightCateButton, setShowRightCateButton] = useState(false);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const [showLeftFoodButton, setShowLeftFoodButton] = useState(false);
  const [showRightFoodButton, setShowRightFoodButton] = useState(false);

  const [updatedItemsList, setUpdatedItemsList] = useState([]);

  // ===============================
  // CATEGORY FILTER
  // ===============================
  const handleFilterByCategory = (category) => {
    if (category === "All") {
      setUpdatedItemsList(itemsInMyCity);
    } else {
      const filtered = itemsInMyCity?.filter(
        (i) => i.category === category
      );
      setUpdatedItemsList(filtered);
    }
  };

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity || []);
  }, [itemsInMyCity]);

  // ===============================
  // UPDATE BUTTON VISIBILITY
  // ===============================
  const updateButton = (ref, setLeftButton, setRightButton) => {
    const el = ref.current;
    if (!el) return;

    setLeftButton(el.scrollLeft > 0);

    setRightButton(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  // ===============================
  // ENTRY ANIMATION
  // ===============================
  const animateOnScroll = (ref) => {
    const container = ref.current;
    if (!container) return;

    const cards = container.querySelectorAll(".scroll-anim");

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("in-view");
        }),
      { threshold: 0.3 }
    );

    cards.forEach((c) => observer.observe(c));
  };

  // ===============================
  // CATEGORY SCROLL SETUP
  // ===============================
  useEffect(() => {
    const el = cateScrollRef.current;
    if (!el) return;

    const handleScroll = () =>
      updateButton(cateScrollRef, setShowLeftCateButton, setShowRightCateButton);

    handleScroll();
    el.addEventListener("scroll", handleScroll);

    animateOnScroll(cateScrollRef);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [categories]);

  // ===============================
  // SHOP SCROLL SETUP
  // ===============================
  useEffect(() => {
    const el = shopScrollRef.current;
    if (!el) return;

    const handleScroll = () =>
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);

    handleScroll();
    el.addEventListener("scroll", handleScroll);

    animateOnScroll(shopScrollRef);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [shopInMyCity]);

  // ===============================
  // FOOD SCROLL SETUP (REFRESH FIX)
  // ===============================
  useEffect(() => {
    const el = foodScrollRef.current;
    if (!el) return;

    const handleScroll = () =>
      updateButton(foodScrollRef, setShowLeftFoodButton, setShowRightFoodButton);

    handleScroll();
    el.addEventListener("scroll", handleScroll);

    animateOnScroll(foodScrollRef);

    return () => el.removeEventListener("scroll", handleScroll);
  }, [updatedItemsList]);

  return (
    <>
      {/* SCROLL ANIMATION STYLE */}
      <style>{`
        .scroll-anim {
          opacity: 0;
          transform: translateY(20px) scale(0.96);
          transition: all 0.45s ease;
        }
        .scroll-anim.in-view {
          opacity: 1;
          transform: translateY(0px) scale(1);
        }
        .smooth-snap {
          scroll-snap-type: x mandatory;
        }
        .snap-card {
          scroll-snap-align: start;
        }
      `}</style>

      <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6]">

        <Navbar />

        {/* ================= SEARCH RESULTS ================= */}
        {searchItems && searchItems.length > 0 && (
          <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4">
            <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b pb-2">
              Search Results
            </h1>
            <div className="w-full flex flex-wrap gap-6 justify-center">
              {searchItems.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          </div>
        )}

        {/* ================= CATEGORY SECTION ================= */}
        <div className="w-full max-w-6xl flex flex-col items-start p-[10px]">
          <h1 className="text-gray-800 md:text-2xl font-semibold mb-2">
            Inspiration for your first order
          </h1>

          <div className="w-full relative">

            {showLeftCateButton && (
              <button
                onClick={() => scrollHandler(cateScrollRef, "left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                bg-white/90 shadow-md rounded-full p-2 hidden md:flex"
              >
                <FaArrowLeft className="text-[#ff4d2d]" />
              </button>
            )}

            <div
              ref={cateScrollRef}
              className="w-full flex gap-4 overflow-x-auto pb-3 px-6 smooth-snap"
            >
              {categories.map((cate, i) => (
                <div key={i} className="scroll-anim snap-card">
                  <CategoryCard
                    name={cate.category}
                    image={cate.image}
                    key={i}
                    onClick={() => handleFilterByCategory(cate.category)}
                  />
                </div>
              ))}
            </div>

            {showRightCateButton && (
              <button
                onClick={() => scrollHandler(cateScrollRef, "right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                bg-white/90 shadow-md rounded-full p-2 hidden md:flex"
              >
                <FaArrowRight className="text-[#ff4d2d]" />
              </button>
            )}
          </div>
        </div>

        {/* ================= SHOP SECTION ================= */}
        <div className="w-full max-w-6xl flex flex-col items-start p-[10px]">
          <h1 className="text-gray-800 md:text-2xl font-semibold mb-2">
            Best Shops in {currentCity}
          </h1>

          <div className="w-full relative">

            {showLeftShopButton && (
              <button
                onClick={() => scrollHandler(shopScrollRef, "left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                bg-white/90 shadow-md rounded-full p-2 hidden md:flex"
              >
                <FaArrowLeft className="text-[#ff4d2d]" />
              </button>
            )}

            <div
              ref={shopScrollRef}
              className="w-full flex gap-4 overflow-x-auto pb-3 px-6 smooth-snap"
            >
              {shopInMyCity?.length > 0 ? (
                shopInMyCity.map((shop, i) => (
                  <div key={i} className="scroll-anim snap-card">
                    <CategoryCard
                      name={shop.name}
                      key={i}
                      image={shop.image}
                      onClick={() => navigate(`/shop/${shop._id}`)}
                    />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No shops available.</p>
              )}
            </div>

            {showRightShopButton && (
              <button
                onClick={() => scrollHandler(shopScrollRef, "right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                bg-white/90 shadow-md rounded-full p-2 hidden md:flex"
              >
                <FaArrowRight className="text-[#ff4d2d]" />
              </button>
            )}
          </div>
        </div>

        {/* ================= FOOD SECTION ================= */}
        <div className="w-full max-w-6xl flex flex-col items-start p-[10px]">
          <h1 className="text-gray-800 md:text-2xl font-semibold mb-2">
            Suggested Food Items
          </h1>

          <div className="w-full relative">

            {showLeftFoodButton && (
              <button
                onClick={() => scrollHandler(foodScrollRef, "left")}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                bg-white/90 shadow-md rounded-full p-2 hidden md:flex"
              >
                <FaArrowLeft className="text-[#ff4d2d]" />
              </button>
            )}

            <div
              ref={foodScrollRef}
              className="w-full flex gap-4 overflow-x-auto pb-3 px-6 smooth-snap"
            >
              {updatedItemsList?.map((item, i) => (
                <div key={i} className="scroll-anim snap-card min-w-[240px]">
                  <FoodCard data={item} />
                </div>
              ))}
            </div>

            {showRightFoodButton && (
              <button
                onClick={() => scrollHandler(foodScrollRef, "right")}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                bg-white/90 shadow-md rounded-full p-2 hidden md:flex"
              >
                <FaArrowRight className="text-[#ff4d2d]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
