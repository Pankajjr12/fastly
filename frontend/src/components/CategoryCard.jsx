import React from "react";

const CategoryCard = ({name,image,onClick}) => {
  return (
    <div
      className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px]
      rounded-2xl overflow-hidden bg-gradient-to-br from-[#fff] to-[#fff6f2]
      shadow-md hover:shadow-2xl hover:scale-[1.04] hover:-translate-y-1 
      transition-all duration-500 ease-in-out cursor-pointer"  onClick={onClick}
    >
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
      />

      {/* Overlay Gradient (for better contrast on image) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      {/* Text Overlay with Glass Effect */}
      <div
        className="absolute bottom-0 left-0 w-full py-[6px] sm:py-2
        text-center text-white font-semibold tracking-wide 
        text-[11px] sm:text-sm md:text-base 
        backdrop-blur-md bg-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.3)]
        rounded-t-2xl border-t border-white/20"
      >
        {name}
      </div>

      {/* Subtle Inner Glow */}
      <div className="absolute inset-0 ring-1 ring-white/10" />
    </div>
  );
};

export default CategoryCard;
