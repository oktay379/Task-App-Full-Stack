import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../App';
import { RiLogoutBoxLine } from "react-icons/ri";
import axios from 'axios';
import Search from './Search';

const Navbar = () => {

  const {user} = useContext(userContext);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.post("http://localhost:3000/auth/logout")
    .then(res => {
      if(res.data === "Success") {
        navigate("/login");
        navigate(0);
      }
    })
    .catch(err => console.log(err))
  };


  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg h-20 px-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-bold">
          <Link to={"/"}>
            <div className="text-3xl font-extrabold text-indigo-100" to={"/"}>
              Playable Factory
            </div>
          </Link>
        </div>

        <Search />

        <div className="hidden md:flex space-x-4">
          {
            !user.username ? 
            <div className="flex gap-5">       
             <Link to="/login" className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-gray-200">Login</Link>
             <Link to="/register" className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-400">Register</Link>            
            </div>
            : 
            <div onClick={handleLogout} className="flex cursor-pointer items-center gap-3 p-1 border border-gray-800 rounded-md shadow-md bg-gray-100">
              <span className="font-semibold text-gray-700">{user.username}</span>
              <img className="h-10 w-10 rounded-full border border-gray-300" src={user.file} alt="user" />
              <RiLogoutBoxLine
                className="text-gray-600 cursor-pointer hover:text-red-600"
                size={24}
              />
            </div>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
