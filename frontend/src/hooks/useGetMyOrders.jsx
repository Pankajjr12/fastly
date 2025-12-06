import axios from 'axios'
import React, { useEffect } from 'react'
import { apiUrl } from '../config/api.js'
import { useDispatch, useSelector } from 'react-redux'
import { setMyOrders, setUserData } from '../redux/userSlice.js'

function useGetMyOrders() {
    const dispatch=useDispatch()
    const {userData}=useSelector(state=>state.user)
  useEffect(()=>{
  const fetchOrders=async () => {
    try {
           const result=await axios.get(`${apiUrl}/api/order/my-orders`,{withCredentials:true})
            dispatch(setMyOrders(result.data))
   


    } catch (error) {
        console.log(error)
    }
}
  fetchOrders()

 
  
  },[userData])
}

export default useGetMyOrders
