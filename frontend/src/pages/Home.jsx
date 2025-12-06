import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from './dashboards/UserDashboard'
import DeliveryBoy from './dashboards/DeliveryBoy'
import OwnerDashboard from './dashboards/OwnerDashboard'

const Home = () => {
    const { userData } = useSelector(state => state.user)
    return (
        <div className='w-[100vw] min-h-[100vh] pt-[100px]  items-center'
            style={{ color: 'var(--bg-color)' }}>
            {userData.role == "user" && <UserDashboard />}
            {userData.role == "owner" && <OwnerDashboard />}
            {userData.role == "deliveryBoy" && <DeliveryBoy />}
        </div>
    )
}

export default Home