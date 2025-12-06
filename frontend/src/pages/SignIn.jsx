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

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
 const[loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Auto-hide errors after 5 seconds
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const timer = setTimeout(() => setErrors({}), 5000)
      return () => clearTimeout(timer)
    }
  }, [errors])

  const handleSignIn = async () => {
    setLoading(true)
    const newErrors = {}

    if (!email.trim()) newErrors.email = "Email is required"
    if (!password.trim()) newErrors.password = "Password is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const result = await axios.post(`${apiUrl}/api/auth/signin`, { email, password }, { withCredentials: true })
      dispatch(setUserData(result.data))
      setErrors({})
      setLoading(false)
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Signin failed" })
    }
    finally {
        setLoading(false) // stop loading in both success and error
    }
  }

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const { data } = await axios.post(`${apiUrl}/api/auth/google-auth`, {
        email: result.user.email
      }, { withCredentials: true })
      dispatch(setUserData(data))
      setErrors({})
    } catch (error) {
      setErrors({ general: "Google sign-in failed" })
      console.error(error)
    }
  }

  return (
    <div className='min-h-screen w-full flex items-center justify-center p-4 bg-[var(--bg-color)]'>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]" style={{ borderColor: 'var(--border-color)' }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-color)' }}>FastLy</h1>
        <p className="mb-4">Sign in to your account to continue</p>

        {/* Email */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1'>Email</label>
          <input
            type="email"
            className='w-full border rounded-lg px-3 py-2 focus:outline-none'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <p className="text-red-500 text-sm h-5 mt-1">{errors.email}</p>
        </div>

        {/* Password */}
        <div className='mb-4'>
          <label className='block text-gray-700 font-medium mb-1'>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className='w-full border rounded-lg px-3 pr-10 py-2 focus:outline-none'
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

        {/* Forgot Password */}
        <div className='text-right mb-4 text-[var(--primary-color)] font-medium cursor-pointer' onClick={() => navigate('/forgot-password')}>
          Forgot Password?
        </div>

        {/* General Error */}
        {errors.general && <p className="text-red-500 text-center mb-4">{errors.general}</p>}

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className='w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[var(--primary-color)] text-white hover:bg-[var(--hover-color)]' disabled={loading}
        >{loading ? <ClipLoader size={10} color='white'/> : " Sign In"}
         
        </button>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleAuth}
          className='w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200 border-gray-200 hover:bg-gray-100'
        >
          <FcGoogle size={20} />
          <span>Sign In with Google</span>
        </button>

        {/* Sign Up Link */}
        <p className='text-center mt-2'>
          Don't have an account?
          <span className='text-[var(--primary-color)] cursor-pointer' onClick={() => navigate("/signup")}> Sign Up</span>
        </p>
      </div>
    </div>
  )
}

export default SignIn
