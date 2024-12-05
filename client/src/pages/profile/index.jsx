// src/pages/ProfileSetup.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '../../lib/api-client'; // Ensure this is correctly set up
import { useAppStore } from '../../store';
import { useNavigate } from 'react-router-dom';
import { UPDATE_USER_INFO } from '../../utils/constant';

const ProfileSetup = () => {
  const { userInfo, updateProfile ,setUserInfo} = useAppStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // State to store profile setup form data
  const [profileData, setProfileData] = useState({
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    profileImage: null,
    favoriteColor: userInfo?.favoriteColor || '#000000',
  });

  const [imagePreview, setImagePreview] = useState(null); // New state for image preview

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        // Optional: Validate file type and size
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          toast.error('Please select a valid image (jpeg, png, gif).');
          return;
        }

        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
          toast.error('Image size should be less than 2MB.');
          return;
        }

        setProfileData({
          ...profileData,
          profileImage: file,
        });

        const previewURL = URL.createObjectURL(file);
        setImagePreview(previewURL);
      } else {
        setProfileData({
          ...profileData,
          profileImage: null,
        });
        setImagePreview(null);
      }
    } else {
      setProfileData({
        ...profileData,
        [name]: value,
      });
    }
  };

  // Cleanup the object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Function to handle profile setup submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!profileData.firstName || !profileData.lastName) {
      toast.error('First name and last name are required.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('favoriteColor', profileData.favoriteColor);
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage);
      }

      const response = await apiClient.post(UPDATE_USER_INFO, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Ensure cookies are sent
      });

      if (response.data.success) {
        setUserInfo(response.data.user)
        updateProfile(response.data.user); // Adjust based on your response structure
        toast.success('Profile updated successfully!');
        navigate('/chat'); // Redirect to a desired page
      } else {
        toast.error(response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle removing the selected image
  const handleRemoveImage = () => {
    setProfileData({
      ...profileData,
      profileImage: null,
    });
    setImagePreview(null);
  };

  // Function to get the initial from email
  const getEmailInitial = (email) => {
    if (!email) return '';
    return email.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-600"></div>
        <p className="mt-4 text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row">
        {/* Profile Image / Initial */}
        <div className="md:w-1/3 flex flex-col items-center justify-center mb-6 md:mb-0">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-40 h-40 object-cover rounded-full border-2 border-purple-600"
              />
              {/* Close Button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none"
                aria-label="Remove Image"
              >
                &times;
              </button>
            </div>
          ) : (
            <div className="w-40 h-40 flex items-center justify-center bg-gray-200 text-4xl text-gray-700 rounded-full border-2 border-purple-600">
              {getEmailInitial(userInfo?.email)}
            </div>
          )}
          <label
            htmlFor="profileImage"
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 transition duration-300"
          >
            Upload Image
            <input
              type="file"
              name="profileImage"
              id="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Form */}
        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center md:text-left">Set Up Your Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-gray-700 font-medium">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={userInfo?.username || ''}
                readOnly
                className="w-full p-3 mt-1 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={userInfo?.email || ''}
                readOnly
                className="w-full p-3 mt-1 bg-gray-200 border border-gray-300 rounded-md cursor-not-allowed"
              />
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-gray-700 font-medium">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={profileData.firstName}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-gray-700 font-medium">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={profileData.lastName}
                onChange={handleChange}
                className="w-full p-3 mt-1 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Favorite Color */}
            <div>
              <label htmlFor="favoriteColor" className="block text-gray-700 font-medium">
                Favorite Color
              </label>
              <input
                type="color"
                name="favoriteColor"
                id="favoriteColor"
                value={profileData.favoriteColor}
                onChange={handleChange}
                className="w-12 h-12 mt-1 border-none cursor-pointer"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white font-bold rounded-md hover:bg-purple-700 transition duration-300"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
