import React, { useState, useEffect } from 'react'
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { ClipLoader } from 'react-spinners'
import { apiUrl } from '../config/api';
import { auth } from '../firebase.js'
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice.js';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const navigate = useNavigate()

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [mobile, setMobile] = useState("")
    const [errors, setErrors] = useState({})
    const[loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    // Auto-hide errors after 5 seconds
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const timer = setTimeout(() => setErrors({}), 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    const handleSignUp = async () => {
            setLoading(true)
        const newErrors = {}
        if (!fullName.trim()) newErrors.fullName = "Full name is required"
        if (!email.trim()) newErrors.email = "Email is required"
        if (!mobile.trim()) newErrors.mobile = "Mobile number is required"
        if (!password.trim()) newErrors.password = "Password is required"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            const result = await axios.post(`${apiUrl}/api/auth/signup`, { fullName, email, mobile, password, role }, { withCredentials: true })
            dispatch(setUserData(result.data))
            setErrors({})
            setLoading(false)
        } catch (error) {
            setErrors({ general: error.response?.data?.message || "Signup failed" })
        }
        finally {
        setLoading(false) // stop loading in both success and error
    }
    }

    const handleGoogleAuth = async () => {
        if (!mobile) return setErrors({ mobile: "Mobile no is required." })
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${apiUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            dispatch(setUserData(data))
            setErrors({})
        } catch (error) {
            setErrors({ general: "Google sign-up failed" })
            console.error(error)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center p-4 bg-[var(--bg-color)]'>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 border border-[var(--border-color)] mx-2 sm:mx-0">
                <h1 className="text-3xl font-bold mb-2 text-center sm:text-left" style={{ color: 'var(--primary-color)' }}>FastLy</h1>
                <p className="text-center sm:text-left mb-6 text-gray-700">Create your account to start ordering delicious meals</p>

                {/* Full Name */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Full Name</label>
                    <input
                        type="text"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition'
                        placeholder='Enter your full name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <p className="text-red-500 text-sm h-5 mt-1">{errors.fullName}</p>
                </div>

                {/* Email */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Email</label>
                    <input
                        type="email"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="text-red-500 text-sm h-5 mt-1">{errors.email}</p>
                </div>

                {/* Mobile */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Mobile</label>
                    <input
                        type="number"
                        className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition'
                        placeholder='Enter your mobile no'
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    <p className="text-red-500 text-sm h-5 mt-1">{errors.mobile}</p>
                </div>

                {/* Password */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            className='w-full border rounded-lg px-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition'
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>
                    <p className="text-red-500 text-sm h-5 mt-1">{errors.password}</p>
                </div>

                {/* Role */}
                <div className='mb-4'>
                    <label className='block text-gray-700 font-medium mb-1'>Role</label>
                    <div className="flex gap-2 flex-wrap">
                        {["user", "owner", "deliveryBoy"].map(r => (
                            <button
                                key={r}
                                type="button"
                                className="flex-1 sm:flex-auto border rounded-lg px-3 py-2 text-center font-medium transition-colors"
                                onClick={() => setRole(r)}
                                style={
                                    role === r ? { backgroundColor: 'var(--primary-color)', color: "white" } :
                                        { border: '1px solid var(--primary-color)', color: "#333" }
                                }
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                {/* General Error */}
                {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}

                {/* Sign Up Button */}
                <button
                    onClick={handleSignUp}
                    className='w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[var(--primary-color)] text-white hover:bg-[var(--hover-color)]' disabled={loading}
                >{loading ? <ClipLoader size={10} color='white'/> : " Sign Up"}
                    
                </button>

                {/* Google Sign Up */}
                <button
                    onClick={handleGoogleAuth}
                    className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-200 hover:bg-gray-100'
                >
                    <FcGoogle size={20} />
                    <span>Sign up with Google</span>
                </button>

                {/* Sign In Link */}
                <p className='text-center mt-4 text-gray-700'>
                    Already have an account?
                    <span className='text-[var(--primary-color)] cursor-pointer ml-1' onClick={() => navigate("/signin")}>Sign In</span>
                </p>
            </div>
        </div>
    )
}

export default SignUp
