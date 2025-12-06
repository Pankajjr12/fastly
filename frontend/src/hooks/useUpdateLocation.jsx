import axios from "axios";
import React, { useEffect } from "react";
import { apiUrl } from "../config/api.js";
import { useDispatch, useSelector } from "react-redux";

function useUpdateLocation() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const result = await axios.post(
        `${apiUrl}/api/user/update-location`,
        { lat, lon },
        { withCredentials: true }
      );
      console.log(result.data);
    };

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [userData]);
}

export default useUpdateLocation;
