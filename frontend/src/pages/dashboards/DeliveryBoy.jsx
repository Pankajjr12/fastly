import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { apiUrl } from "../../config/api";
import DeliveryBoyTracking from "../../components/DeliveryBoyTracking";
import { ClipLoader } from "react-spinners";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { socket } from "../../socket";

const DeliveryBoy = () => {
  const { userData } = useSelector((state) => state.user);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // -------------------------------------------
  // 1️⃣ Identify DeliveryBoy on socket connect
  // -------------------------------------------
  useEffect(() => {
    if (userData.role !== "deliveryBoy") return;

    const identify = () => {
      socket.emit("identity", {
        userId: userData._id,
        role: "deliveryBoy",
      });
    };

    // Initial connection
    identify();

    // Reconnection
    socket.on("connect", identify);
    socket.io.on("reconnect", identify);

    return () => {
      socket.off("connect", identify);
      socket.io.off("reconnect", identify);
    };
  }, [userData._id, userData.role]);

  // -------------------------------------------
  // 2️⃣ Listen for NEW Assignments
  // -------------------------------------------
  useEffect(() => {
    if (userData.role !== "deliveryBoy") return;

    const handleNewAssignment = (data) => {
      setAvailableAssignments((prev) => [...prev, data]);
    };

    socket.on("newAssignment", handleNewAssignment);

    return () => {
      socket.off("newAssignment", handleNewAssignment);
    };
  }, [userData.role]);

  // -------------------------------------------
  // 3️⃣ Track DeliveryBoy Location + emit to server
  // -------------------------------------------
  useEffect(() => {
    if (userData.role !== "deliveryBoy") return;

    let watchId = null;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setDeliveryBoyLocation({ lat: latitude, lon: longitude });

          socket.emit("updateLocation", {
            userId: userData._id,
            latitude,
            longitude,
          });
        },
        (error) => console.log(error),
        { enableHighAccuracy: true }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [userData._id, userData.role]);

  // --------------------------------------------------
  // Fetching APIs (Assignments, CurrentOrder, Deliveries)
  // --------------------------------------------------

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${apiUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      setAvailableAssignments(result.data || []);
    } catch (error) {
      console.log("Get Assignments Error:", error);
    }
  };

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${apiUrl}/api/order/get-current-order`, {
        withCredentials: true,
      });

      setCurrentOrder(result.data || null);
      console.log("Current Order:", result.data);
    } catch (error) {
      console.log("Get Current Order Error:", error);
    }
  };

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(
        `${apiUrl}/api/order/get-today-deliveries`,
        { withCredentials: true }
      );
      setTodayDeliveries(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Initial load
  useEffect(() => {
    if (userData.role !== "deliveryBoy") return;

    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData.role]);

  // --------------------------------------------------
  // Accept Order
  // --------------------------------------------------
  const acceptOrder = async (assignmentId) => {
    try {
      await axios.get(`${apiUrl}/api/order/accept-order/${assignmentId}`, {
        withCredentials: true,
      });

      await getCurrentOrder();
    } catch (error) {
      console.log("Accept Order Error:", error);
    }
  };

  // --------------------------------------------------
  // OTP APIs
  // --------------------------------------------------

  const sendOtp = async () => {
    if (!currentOrder || !currentOrder.shopOrder) return;

    setLoading(true);
    try {
      const result = await axios.post(
        `${apiUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );
      setLoading(false);
      setShowOtpBox(true);
    } catch (error) {
      console.log("SEND OTP ERROR:", error.response?.data || error);
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setMessage("");

    try {
      const result = await axios.post(
        `${apiUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true }
      );

      setMessage(result.data.message || "OTP Verified!");
      setTimeout(() => location.reload(), 1500);
    } catch (error) {
      console.log("VERIFY OTP ERROR:", error.response?.data || error);
      setMessage("Invalid OTP");
    }
  };

  const ratePerDelivery = 50;
  const totalEarning = todayDeliveries.reduce(
    (sum, d) => sum + d.count * ratePerDelivery,
    0
  );

  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        {/* USER CARD */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col items-center w-[90%] border border-orange-100 text-center gap-2">
          <h1 className="text-xl font-bold text-[#ff69b4]">
            Welcome, {userData.fullName}
          </h1>

          <p className="text-[#ff69b4]">
            <span className="font-semibold">Latitude:</span>{" "}
            {deliveryBoyLocation?.lat},{" "}
            <span className="font-semibold">Longitude:</span>{" "}
            {deliveryBoyLocation?.lon}
          </p>
        </div>

        {/* ---------------------- */}
        {/* SHOW ASSIGNMENTS & EARNINGS */}
        {/* ---------------------- */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-orange-100">
            <h1 className="text-lg font-bold mb-3 text-[#ff69b4]">
              Today Deliveries
            </h1>

            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={todayDeliveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(v) => [v, "orders"]} />
                <Bar dataKey="count" fill="#ff69b4" />
              </BarChart>
            </ResponsiveContainer>

            <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-2xl shadow-lg text-center">
              <h1 className="text-xl font-semibold text-gray-800 mb-2">
                Today's Earning
              </h1>
              <span className="text-3xl font-bold text-green-600">
                ₹{totalEarning}
              </span>
            </div>
          </div>
        )}

        {/* AVAILABLE ORDERS */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4">Available Orders</h1>

            <div className="space-y-4">
              {availableAssignments.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      <p className="text-sm font-semibold">{a.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Delivery:</span>{" "}
                        {a.deliveryAddress.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.items.length} items | ₹{a.subtotal}
                      </p>
                    </div>

                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {/* CURRENT ORDER SECTION */}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-bold mb-3">📦 Current Order</h2>

            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm text-black">
                {currentOrder.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder.deliveryAddress.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder.shopOrder.shopOrderItems.length} items | ₹
                {currentOrder.shopOrder.subtotal}
              </p>
            </div>

            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: {
                  lat: deliveryBoyLocation?.lat,
                  lon: deliveryBoyLocation?.lon,
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />

            {!showOtpBox ? (
              <button
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600"
                onClick={sendOtp}
                disabled={loading}
              >
                {loading ? (
                  <ClipLoader size={20} color="white" />
                ) : (
                  "Mark As Delivered"
                )}
              </button>
            ) : (
              <div className="mt-4 p-4 space-y-2 border rounded-xl bg-gray-50">
                <p className="text-sm font-semibold">
                  Enter OTP sent to{" "}
                  <span className="text-orange-500">
                    {currentOrder.user.fullName}
                  </span>
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  className="w-full border border-black text-black px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-400 tracking-widest text-center text-lg"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />

                {message && (
                  <p className="text-center text-green-500 text-lg">
                    {message}
                  </p>
                )}

                <button
                  className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoy;
