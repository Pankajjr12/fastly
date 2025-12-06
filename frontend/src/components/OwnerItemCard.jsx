import axios from "axios";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../config/api";
import { useDispatch } from "react-redux";
import { setMyShopData } from "../redux/ownerSlice";

const OwnerItemCard = ({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      const result = await axios.delete(`${apiUrl}/api/item/delete/${data._id}`, {
        withCredentials: true,
      });
      dispatch(setMyShopData(result.data));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="flex bg-white rounded-lg shadow-md overflow-hidden border 
    border-[#ff42d] w-full max-w-2xl mb-2"
    >
      <div className="w-36 max-h-40 flex-shrink-0 bg-gray-50 overflow-hidden rounded-r-xl">
        <img src={data.image} alt="no" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col justify-between p-3 flex-1">
        <div className="">
          <h2 className="text-base font-semibold text-[#ff4d2d] ">
            {data.name}
          </h2>
          <p className="font-medium text-sm text-[#484848]">Category : {data.category}</p>
          <p className="font-medium text-sm text-[#484848]">FoodType : {data.foodType}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-[#ff4d2d] font-bold">{data.price}</div>
          <div className="flex items-center gap-2">
            <div
              className=" p-2 rounded-full cursor-pointer hover:bg-[#ff4d2d]/10 text-[#ff4d2d]"
              onClick={() => navigate(`/edit-item/${data._id}`)}
            >
              <FiEdit2 size={16} />
            </div>
            <div
              className=" p-2 rounded-full cursor-pointer hover:bg-[#ff4d2d]/10 text-[#ff4d2d] "
              onClick={handleDelete}
            >
              <FiTrash2 size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerItemCard;
