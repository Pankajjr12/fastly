import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../redux/userSlice.js'
import ownerSlice from '../redux/ownerSlice.js'
import mapSlice from '../redux/mapSlice.js'

export const store = configureStore({
    reducer:{
        user:userSlice,
        owner:ownerSlice,
        map:mapSlice
    }

})