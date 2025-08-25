import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import authAPI from "../../api/AuthAPI";

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(0);
    const timerRef = useRef(null);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        setError("");
        setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setStep(2);
            setResendTimer(60);
            timerRef.current = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError(
                err?.response?.data?.message || "Không thể gửi OTP. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError("");
        setLoading(true);
        try {
            await authAPI.verifyOtp(email, otp);
            setStep(3);
        } catch (err) {
            setError(
                err?.response?.data?.message || "OTP không đúng. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setError("");
        if (newPassword.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }
        setLoading(true);
        try {
            await authAPI.resetPassword({ email, otp, newPassword });
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigate("/login");
        } catch (err) {
            setError(
                err?.response?.data?.message || "Không thể đổi mật khẩu. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setError("");
        setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setResendTimer(60);
            timerRef.current = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            alert("OTP đã được gửi lại!");
        } catch (err) {
            setError(
                err?.response?.data?.message || "Không thể gửi lại OTP. Vui lòng thử lại."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-8 py-6">
                    <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
                        Quên mật khẩu
                    </h2>
                    <div className="space-y-4">
                        {step === 1 && (
                            <>
                                <input
                                    type="email"
                                    placeholder="Nhập email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSendOtp}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                                    disabled={loading || !email}
                                >
                                    {loading ? "Đang gửi OTP..." : "Gửi OTP"}
                                </button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Nhập mã OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleVerifyOtp}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                                    disabled={loading || !otp}
                                >
                                    {loading ? "Đang xác thực..." : "Xác thực OTP"}
                                </button>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm text-gray-600">
                                        Chưa nhận được OTP?
                                    </span>
                                    <button
                                        onClick={handleResendOtp}
                                        className={`text-blue-500 hover:underline text-sm ml-2 ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        disabled={resendTimer > 0 || loading}
                                    >
                                        {resendTimer > 0
                                            ? `Gửi lại (${resendTimer}s)`
                                            : "Gửi lại OTP"}
                                    </button>
                                </div>
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <input
                                    type="password"
                                    placeholder="Mật khẩu mới"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={loading}
                                />
                                <input
                                    type="password"
                                    placeholder="Xác nhận mật khẩu mới"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleResetPassword}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                                    disabled={loading || !newPassword || !confirmPassword}
                                >
                                    {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
                                </button>
                            </>
                        )}

                        {error && (
                            <div className="text-red-500 text-sm text-center">{error}</div>
                        )}

                        <div className="text-center text-sm text-gray-600 mt-4">
                            <button
                                onClick={() => navigate("/login")}
                                className="text-blue-500 hover:underline"
                            >
                                Quay về đăng nhập
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;