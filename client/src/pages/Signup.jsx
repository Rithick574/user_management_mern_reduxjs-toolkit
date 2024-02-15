import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData } from "../redux/features/userSlice";
import {
  isEmpty,
  isPasswordValid,
  isEmailValid,
  passwordcheck,
} from "../../helper/validation";


const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userdata = useSelector((state) => state.user.userData);

  const [error, setError] = useState({
    emailred: false,
    namered: false,
    passwordred: false,
    confirmpasswordred: false,
  });
  const [errordef, seterrordef] = useState({
    emailerr: "",
    nameerr: "",
    passworderr: "",
    confirmpassworderr: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    } else if (field === "confirmpassword") {
      setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
    }
  };
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    Password: "",
    confirmpassword: "",
  });

  const handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    let errors = {
        emailred: false,
        namered: false,
        passwordred: false,
        confirmpasswordred: false,
    };

    let errorMessages = {
        emailerr: "",
        nameerr: "",
        passworderr: "",
        confirmpassworderr: ""
    };
     // Validate email
     if (isEmpty(userData.email)) {
        errors.emailred = true;
        errorMessages.emailerr = "Email can't be empty";
    } else if (isEmailValid(userData.email)) {
        errors.emailred = true;
        errorMessages.emailerr = "Enter a valid email";
    }

      // Validate name
      if (isEmpty(userData.name)) {
        errors.namered = true;
        errorMessages.nameerr = "Name can't be empty";
    }

    // Validate password
    if (isEmpty(userData.Password)) {
        errors.passwordred = true;
        errorMessages.passworderr = "Password can't be empty";
    } else if (isPasswordValid(userData.Password)) {
        errors.passwordred = true;
        errorMessages.passworderr = "Password is too weak";
    }

      // Validate confirm password
      if (isEmpty(userData.confirmpassword)) {
        errors.confirmpasswordred = true;
        errorMessages.confirmpassworderr = "Confirm password can't be empty";
    } else if (passwordcheck(userData.Password, userData.confirmpassword)) {
        errors.confirmpasswordred = true;
        errorMessages.confirmpassworderr = "Passwords don't match";
    }

    setError(errors);
    seterrordef(errorMessages);


    if (!errors.emailred && !errors.namered && !errors.passwordred && !errors.confirmpasswordred) {
        async function register() {
            try {
                await axios.post('http://localhost:5000/signup', userData)
                    .then((response) => {
                        if (response.data.success) {
                            axios.get('http://localhost:5000/fetchuserdata').then((response) => {
                                dispatch(setUserData(response.data))
                            })
                            navigate('/home')

                        } else if (response.data.error) {
                            setError((previous) => ({
                                ...previous,
                                emailred: true
                            }))
                            seterrordef((previous) => ({
                                ...previous,
                                emailerr: response.data.error
                            }))
                        }
                    })

            } catch (error) {
                console.log(error);
            }
        }
        register()
    }

  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <h2 className="text-4xl font-bold mb-4">Signup</h2>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name:
            </label>
            <input
              type="text"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="name"
              name="name"
            />
            {error.namered && (
              <div className="text-red-500 mt-1">{errordef.nameerr}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email:
            </label>
            <input
              type="email"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="email"
              name="email"
              autoComplete="email"
            />
            {error.emailred && (
              <div className="text-red-500 mt-1">{errordef.emailerr}</div>
            )}
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="password"
              autoComplete="new-password"
              name="Password"
            />
            {error.passwordred && (
              <div className="text-red-500 mt-1">{errordef.passworderr}</div>
            )}
            <button
              type="button"
              className="absolute right-2 bottom-2"
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600">
              Confirm Password:
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              placeholder="confirm password"
              name="confirmpassword"
              autoComplete="confirm-password"
            />
            {error.confirmpasswordred && (
              <div className="text-red-500 mt-1">
                {errordef.confirmpassworderr}
              </div>
            )}
            <button
              type="button"
              className="absolute right-2 bottom-2"
              onClick={() => togglePasswordVisibility("confirmpassword")}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div className="text-center">
            <button
              onClick={handleSignup}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
              Signup
            </button>
            <p className="mt-2 text-gray-600 cursor-pointer">
              Already have an account?{" "}
              <span
                style={{ color: "blue" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
