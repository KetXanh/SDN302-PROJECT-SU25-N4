import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const handleRegister = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await register({ email, username, password });
      setSuccessMsg('Đăng ký thành công!');
      setTimeout(() => {
        navigate('/pos');
      }, 1200);
    } catch (err) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Đăng ký
          </h2>
          {errorMsg && (
            <div className="mb-4 px-4 py-2 bg-red-100 border border-red-300 text-red-700 rounded text-sm text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 px-4 py-2 bg-green-100 border border-green-300 text-green-700 rounded text-sm text-center">
              {successMsg}
            </div>
          )}
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={handleRegister}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            <div className="text-center text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:underline"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
