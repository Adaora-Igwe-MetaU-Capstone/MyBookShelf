import { useState, useEffect } from 'react'
import './App.css'
import SignUp from './SignUp'
import Login from './Login'
import { useUser } from "./contexts/UserContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import WithAuth from './WithAuth'
import Home from './Home' // You need to import Home too

function App() {
  const { user, setUser } = useUser()
  const [currUser, setCurrUser] = useState("")


  useEffect(() => {
    fetch("http://localhost:3000/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); // Persist login state

          setCurrUser(data); // Set current user state
        }
        console.log(data)
        console.log(user)
      });
  }, []);

  return (
    <BrowserRouter>
      <Routes >
        <Route path="/" element={<Navigate to="/login"/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home currUser={currUser}/>} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
