import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from './contexts/UserContext';
import { Link } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ username: "", password: "" })
    const [message, setMessage] = useState("")
    const { setUser } = useUser()
    const navigate = useNavigate()
    function handleFormChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    async function handleSubmit(e) {
        e.preventDefault()
        console.log("submitted", formData)
        try {
            const response = await fetch("http://localhost:3000/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                    credentials: "include"
                })
            const data = await response.json()
            if (response.ok) {
                setUser(data)
                setMessage({ type: "success", text: "Successfully logged in" })
                navigate("/home")
            } else {
                setMessage({ type: "error", text: data.error || "Login failed" })
            }
        } catch (error) {
            setMessage({ type: "error", text: "Network error. Please try again" })
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" value={formData.username} onChange={handleFormChange} />
                <input type="password" name="password" value={formData.password} onChange={handleFormChange} />
                <button type="submit">Login</button>
                {message && (<div className={`message, ${message.type}`}>
                    {message.text}</div>)}
            </form>
            <p>
                Don't have an account? <Link to="/signup">Register</Link>
            </p>
        </div>
    )
}
export default Login;
