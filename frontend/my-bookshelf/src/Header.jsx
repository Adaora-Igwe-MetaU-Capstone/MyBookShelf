import { useUser } from './contexts/UserContext';
import './Header.css';
function Header(props) {
    const { user, setUser } = useUser()
    return (
        <div className='container'>
            <div onClick={props.toggleSidebar} className='burger-icon'>

                <i className="fa-solid fa-bars"></i>
            </div>
            <div className='user-info'>
                <h2>Welcome {user?.user.username}!</h2>
            </div>
        </div>
    )

}

export default Header;
