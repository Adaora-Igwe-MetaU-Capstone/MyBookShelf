import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext";

const WithAuth = ({ children }) => {
    return function ProtectedComponent(props){
        const { user } = useUser();
        const navigate = useNavigate();
        useEffect(() => {
            if (!user) {
                navigate("/login");
            }
        }, [user, navigate]);
        if (!user) {
            return <p>Loading...</p>; // Prevents flickering before redirection
        }

        return <WrappedComponent {...props} />;
    }
}
export default WithAuth;
