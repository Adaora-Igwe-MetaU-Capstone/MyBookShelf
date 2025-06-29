import { useState } from "react"
import './SideBar.css'
import { useUser } from "./contexts/UserContext";
function Sidebar(props) {
    const { setUser } = useUser()
    const handleLogout = async () => {
        await fetch("http://localhost:3000/logout", { method: "POST", credentials: "include" });
        setUser(null); // Remove user from context
        window.location.href = "/"; // Redirect to homepage
    };
    return (
        <>
            <div id="sidebar" className={`sidebar ${props.isSidebarOpen ? 'open' : ''}`}>

                <i onClick={props.toggleSidebar} id="closeIcon" className="fa-solid fa-xmark"></i>
                <button>View My BookShelf</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </>
    )

}
export default Sidebar;
