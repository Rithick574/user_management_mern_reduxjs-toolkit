import React, { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/features/userSlice";
import Navbar from "../Components/Navbar";


const Profile = () => {

    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);
  
    const [updatedData, setUpdatedData] = useState({
      name: userData.name || "",
      email: userData.email || "",
      role: userData.role || "",
      password: "", 
      profile: userData.profile || "",
      profileImage: null,
      newPassword:""
    });

    const handleUpdateProfile = async () => {
        try {
          const response = await axios.put(
            "http://localhost:5000/updateprofile",
            updatedData
          );
    
          if (response.data.success) {
            dispatch(setUserData(response.data.updatedUserData));
            // Redirect to the profile page after updating
            // You can use 'useNavigate' from 'react-router-dom' here
            // Example: navigate('/profile');
          }
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      };

    const handleChange = (e) => {
        setUpdatedData({
          ...updatedData,
          [e.target.name]: e.target.value,
        });
      };
  return (
   <>
    <Navbar/>
    <div className="max-w-md mx-auto mt-8">
    <div className="flex justify-center items-center">
    <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
    </div>
    <form>
    {/* {updatedData.profile && ( */}
            <div className="flex justify-center items-center mb-4">
              <div className="rounded-full overflow-hidden h-20 w-20">
                <img
                  src={userData.profile}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          {/* )} */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-600">
          Name:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={updatedData.name}
          onChange={handleChange}
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={updatedData.email}
        //   onChange={handleChange}
        readOnly
          className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

    <div className="mb-4">
  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-600">
    Current Password:
  </label>
  <input
    type="password"
    id="currentPassword"
    name="currentPassword"
    value={updatedData.currentPassword}
    onChange={handleChange}
    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
  />
</div>

<div className="mb-4">
  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
    New Password:
  </label>
  <input
    type="password"
    id="newPassword"
    name="newPassword"
    value={updatedData.newPassword}
    onChange={handleChange}
    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
  />
</div>

<div className="mb-4">
  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-600">
    Confirm New Password:
  </label>
  <input
    type="password"
    id="confirmNewPassword"
    name="confirmNewPassword"
    value={updatedData.confirmNewPassword}
    onChange={handleChange}
    className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
  />
</div>


     <div className="flex items-center justify-center">
     <button
        type="button"
        onClick={handleUpdateProfile}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        Update Profile
      </button>
     </div>
    </form>
  </div>
  </>
  )
}

export default Profile