import React, { createContext, useEffect, useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EditTask from './pages/EditTask';


export const userContext = createContext();

const App = () => {

  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);


  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.get("http://localhost:3000/auth/verify")
    .then(user => {
      // console.log(user);
      setUser(user.data)
    })
    .catch(err => console.log(err))
  }, []);


  useEffect(() => {
    axios.get("http://localhost:3000/tasks/user-todos")
    .then((res) => {
      setTasks(res.data)
    })
    .catch(err => console.log(err))
  }, []);


  return (
    <userContext.Provider value={{ user, tasks }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={"/"} element={<Home />}/>
          <Route path={"/register"} element={<Register />}/>
          <Route path={"/login"} element={<Login />}/>
          <Route path={"/edit/:id"} element={<EditTask />}/>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </userContext.Provider>
  )
}

export default App