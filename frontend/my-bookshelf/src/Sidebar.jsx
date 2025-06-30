import { useState } from "react"
import './SideBar.css'
import { useUser } from "./contexts/UserContext";
import { useNavigate } from "react-router-dom";
function Sidebar(props) {
    const { user, setUser } = useUser()
    const handleLogout = async () => {
        await fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" });
        setUser(null); // Remove user from context
        window.location.href = "/"; // Redirect to homepage
    };
    const navigate = useNavigate();
    const viewBookshelf = () => {
        navigate("/mybookshelf")
    }
    return (
        <>
            <div id="sidebar" className={`sidebar ${props.isSidebarOpen ? 'open' : ''}`}>
             <i onClick={props.toggleSidebar} id="closeIcon" className="fa-solid fa-xmark"></i>
             <img id="profile-avatar" src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user?.user.username}`} alt="Profile avatar" />
             <button onClick={viewBookshelf} className="view-bookshelf">View My BookShelf</button>
              <button  className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
        </>
    )

}
export default Sidebar;
