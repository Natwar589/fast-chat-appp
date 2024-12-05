import React, { useState } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../../lib/api-client';
import { LOGIN, SIGN_UP } from '../../utils/constant';
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';

const SignUpLogin = () => {
  const { setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);

  // State to store signup form data
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // State to store login form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Handle checkbox change
  const toggleChecked = () => {
    setIsChecked(!isChecked);
  };

  // Handle signup form input change
  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  // Handle login form input change
  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle signup submission
  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate password length
    if (signupData.password.length < 8) {
      toast.error('Password length must be greater than 8');
      return;
    }

    try {
      const response = await apiClient.post(SIGN_UP, signupData); 
      if (response.data.success) {
        setUserInfo(response.data.data);
        navigate('/profile');
        toast.success('User created successfully');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during signup');
      }
    }
  };

  // Function to handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(LOGIN, loginData);
      if (response.data.success) {
        setUserInfo(response.data.data);
        navigate('/profile');
        toast.success('Login successfully');
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An error occurred during login');
      }
    }
    // You can call an API for login here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="relative w-[350px] h-[500px] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Checkbox to toggle between forms */}
        <input
          type="checkbox"
          id="chk"
          className="hidden"
          checked={isChecked}
          onChange={toggleChecked}
        />

        {/* Sign Up Form */}
        <div
          className={`absolute w-full h-full transition-transform duration-700 ${
            isChecked ? 'translate-y-full' : 'translate-y-0'
          }`}
        >
          <form
            className="flex flex-col items-center justify-center h-full bg-white px-4"
            onSubmit={handleSignup}
          >
            <label htmlFor="chk" className="text-3xl font-bold text-purple-800 mb-8 cursor-pointer">
              Sign up
            </label>
            <input
              type="text"
              name="username"
              placeholder="User name"
              value={signupData.username}
              onChange={handleSignupChange}
              className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signupData.email}
              onChange={handleSignupChange}
              className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signupData.password}
              onChange={handleSignupChange}
              className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            <button className="w-full py-2 bg-purple-600 text-white font-bold rounded-md mt-4 hover:bg-purple-700 transition duration-300">
              Sign up
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{' '}
              <span
                onClick={toggleChecked}
                className="text-purple-600 hover:underline cursor-pointer"
              >
                Login
              </span>
            </p>
          </form>
        </div>

        {/* Login Form */}
        <div
          className={`absolute w-full h-full transition-transform duration-700 ${
            isChecked ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <form
            className="flex flex-col items-center justify-center h-full px-4"
            onSubmit={handleLogin}
          >
            <label htmlFor="chk" className="text-3xl font-bold text-purple-700 mb-8 cursor-pointer">
              Login
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full p-3 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <button className="w-full py-2 bg-purple-600 text-white font-bold rounded-md mt-4 hover:bg-purple-700 transition duration-300">
              Login
            </button>
            <p className="mt-4 text-sm text-gray-600">
              Don't have an account?{' '}
              <span
                onClick={toggleChecked}
                className="text-purple-600 hover:underline cursor-pointer"
              >
                Create one
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpLogin;
