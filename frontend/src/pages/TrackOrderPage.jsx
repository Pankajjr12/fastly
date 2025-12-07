import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";
import { apiUrl } from "../config/api";
import { socket } from "../socket";

function TrackOrderPage() {
  const { orderId } = useParams();
  const [currentOrder, setCurrentOrder] = useState();
  const navigate = useNavigate();
  const [liveLocations, setLiveLocations] = useState({});

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/api/order/get-order-by-id/${orderId}`,
        { withCredentials: true }
      );
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on(
      "updateDeliveryLocation",
      ({ deliveryBoyId, latitude, longitude }) => {
        setLiveLocations((prev) => ({
          ...prev,
          [deliveryBoyId]: { lat: latitude, lng: longitude }, // FIXED
        }));
      }
    );

    return () => {
      socket.off("updateDeliveryLocation");
    };
  }, []);

  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      <div
        className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff69b4]" />
        <h1 className="text-2xl font-bold md:text-center">Track Order</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, index) => {
        const boy = shopOrder.assignedDeliveryBoy;
        const live = liveLocations[boy?._id];

        const fallbackLocation =
          boy?.location?.coordinates?.length === 2
            ? {
                lat: boy.location.coordinates[1],
                lng: boy.location.coordinates[0],
              }
            : null;

        const deliveryBoyLocation = live || fallbackLocation;

        const customerLocation =
          currentOrder?.deliveryAddress?.latitude &&
          currentOrder?.deliveryAddress?.longitude
            ? {
                lat: currentOrder.deliveryAddress.latitude,
                lng: currentOrder.deliveryAddress.longitude,
              }
            : null;

        const canTrack =
          deliveryBoyLocation &&
          deliveryBoyLocation.lat &&
          deliveryBoyLocation.lng &&
          customerLocation &&
          customerLocation.lat &&
          customerLocation.lng &&
          shopOrder.status !== "delivered" &&
          boy;

        return (
          <div
            className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
            key={index}
          >
            <div>
              <p className="text-lg font-bold mb-2 text-[#ff69b4]">
                {shopOrder.shop.name}
              </p>
              <p>
                <span className="font-semibold">Items:</span>{" "}
                {shopOrder.shopOrderItems?.map((i) => i.name).join(",")}
              </p>
              <p>
                <span className="font-semibold">Subtotal:</span>{" "}
                {shopOrder.subtotal}
              </p>
              <p className="mt-6">
                <span className="font-semibold">Delivery address:</span>{" "}
                {currentOrder.deliveryAddress?.text}
              </p>
            </div>

            {/* Delivery Boy Info */}
            {shopOrder.status !== "delivered" ? (
              boy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    Delivery Boy Name: {boy.fullName}
                  </p>
                  <p className="font-semibold">Mobile: {boy.mobile}</p>
                </div>
              ) : (
                <p className="font-semibold">
                  Delivery Boy is not assigned yet.
                </p>
              )
            ) : (
              <p className="text-green-600 font-semibold text-lg">Delivered</p>
            )}

            {/* MAP */}
            {canTrack ? (
              <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                <DeliveryBoyTracking
                  data={{
                    deliveryBoyLocation,
                    customerLocation,
                  }}
                />
              </div>
            ) : (
              boy &&
              shopOrder.status !== "delivered" && (
                <p className="text-sm text-gray-500 italic">
                  Waiting for live location...
                </p>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TrackOrderPage;
