import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SignUp from './SignUp'
import Login from './Login'
import Home from './Home'
import { useEffect } from 'react'
import { useUser } from "./contexts/UserContext"
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
function App() {
  const { user, setUser } = useUser()
  const [currUser, setCurrUser] = useState("")
  useEffect(() => {
    fetch("http://localhost:3000/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUser(data); // Persist login state
          // setCurrUser(data.username)
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
