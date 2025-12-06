import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'
import { apiUrl } from '../config/api';

const ForgotPassword = () => {
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const length = 4; // OTP length
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [otp, setOtp] = useState(Array(length).fill(''));
    const inputRefs = useRef([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    // Auto-hide errors after 5 seconds
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const timer = setTimeout(() => setErrors({}), 5000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    const handleSendOtp = async () => {
        setLoading(true)
        if (!email.trim()) {
            return setErrors({ email: "Email is required" })
        }
        try {
            const result = await axios.post(`${apiUrl}/api/auth/send-otp`, { email }, { withCredentials: true })
            console.log(result)
            setStep(2)
            setErrors({})
        } catch (error) {
            setErrors({ general: error?.response?.data?.message || "Failed to send OTP" })
        }
        finally {
            setLoading(false) // stop loading in both success and error
        }
    }

    const handleVerifyOtp = async () => {
        setLoading(true)
        const otpString = otp.join("");
        if (otpString.length < length) return setErrors({ otp: "Please enter full OTP" })
        try {
            const result = await axios.post(`${apiUrl}/api/auth/verify-otp`, { email, otp: otpString }, { withCredentials: true })
            console.log(result)
            setStep(3)
            setErrors({})
        } catch (error) {
            setErrors({ general: error?.response?.data?.message || "OTP verification failed" })
        }
        finally {
            setLoading(false) // stop loading in both success and error
        }
    }

    const handleResetPassword = async () => {
        setLoading(true)
        if (!newPassword || !confirmPassword) return setErrors({ password: "All fields are required" })
        if (newPassword !== confirmPassword) return setErrors({ password: "Passwords do not match" })
        try {
            const result = await axios.post(`${apiUrl}/api/auth/reset-password`, { email, newPassword }, { withCredentials: true })
            console.log(result)
            navigate("/signin")
            setErrors({})
        } catch (error) {
            setErrors({ general: error?.response?.data?.message || "Reset password failed" })
        }
        finally {
            setLoading(false) // stop loading in both success and error
        }
    }

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, ''); // allow only digits
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < length - 1) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            if (index > 0 && !otp[index]) inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').slice(0, length);
        const newOtp = paste.split('');
        setOtp(newOtp);
        newOtp.forEach((val, i) => {
            if (inputRefs.current[i]) inputRefs.current[i].value = val;
        });
        inputRefs.current[Math.min(newOtp.length, length - 1)].focus();
    };

    return (
        <div className='flex w-full items-center justify-center min-h-screen p-4 bg-[var(--bg-color)]'>
            <div className='bg-white rounded-2xl shadow-xl w-full max-w-md p-6 sm:p-8 border border-[var(--border-color)] mx-2 sm:mx-0'>
                <div className="flex items-center gap-4 mb-4">
                    <FiArrowLeft size={28} className="text-[var(--primary-color)] cursor-pointer" onClick={() => navigate("/signin")} />
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                </div>

                {errors.general && <p className="text-red-500 text-center mb-3">{errors.general}</p>}

                {step === 1 && (
                    <div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 font-medium mb-1'>Email</label>
                            <input
                                type="email"
                                className='w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <button className='w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[var(--primary-color)] text-white hover:bg-[var(--hover-color)]' onClick={handleSendOtp} disabled={loading}
                        >{loading ? <ClipLoader size={10} color='white'/> : " Send Otp"}
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="flex justify-center gap-3 mt-6">
                            {otp.map((value, i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    value={value}
                                    onChange={(e) => handleChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onPaste={handlePaste}
                                    className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] outline-none transition"
                                />
                            ))}
                        </div>
                        {errors.otp && <p className="text-red-500 text-center mt-2">{errors.otp}</p>}
                        <button className='w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[var(--primary-color)] text-white hover:bg-[var(--hover-color)]' onClick={handleVerifyOtp} disabled={loading}
                        >{loading ? <ClipLoader size={10} color='white'/> : " Verify Otp"}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <div className='mb-4'>
                            <label className='block text-gray-700 font-medium mb-1'>New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    className="w-full border rounded-lg px-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
                                    placeholder="Enter your password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                    onClick={() => setShowNewPassword(prev => !prev)}
                                >
                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className='mb-4'>
                            <label className='block text-gray-700 font-medium mb-1'>Confirm New Password</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full border rounded-lg px-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                                    onClick={() => setShowConfirmPassword(prev => !prev)}
                                >
                                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <button className='w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 bg-[var(--primary-color)] text-white hover:bg-[var(--hover-color)]' onClick={handleResetPassword} disabled={loading}
                        >{loading ? <ClipLoader size={10} color='white'/> : " Reset Password"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
