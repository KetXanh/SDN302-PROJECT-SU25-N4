import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    setErrorMsg('');
    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
            Đăng nhập
          </h2>
          {errorMsg && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center">
              {errorMsg}
            </div>
          )}
          <div className="space-y-4">
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
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
            <div className="text-right">
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => navigate('/forgot-password')}
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="text-center text-sm text-gray-600">
              Chưa có tài khoản?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-500 hover:underline"
              >
                Đăng ký
              </button>
            </div>
            <button
              onClick={() => console.log('Login with Google')}
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FcGoogle className="mr-2 text-xl" />
              Đăng nhập với Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
