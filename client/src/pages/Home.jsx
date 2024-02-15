import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {setUserData} from '../redux/features/userSlice'
import Navbar from "../Components/Navbar";
 
const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    axios.get("http://localhost:5000/fetchuserdata").then((response) => {
      dispatch(setUserData(response.data));
    });
  }, []);

  if (!userData || !userData.role) {
    return <Navigate to="/login" />;
  }

  return (
    <>
            <Navbar/>
    </>
)
};

export default Home;
