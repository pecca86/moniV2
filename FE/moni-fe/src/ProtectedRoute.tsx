import { CircularProgress } from "@mui/material";
import { useUser } from "./hooks/auth/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

function ProtectedRoute({ children }) {
    const { token } = useUser();
    const navigate = useNavigate();

    console.log("THE TOKEN IS: ", token);


    useEffect(() => {
        if (!token) {
            toast.error("Please login to your account first");
            navigate('/login');
        }
    }, [token, navigate]);

    if (token) {
        return children;
    }
}

export default ProtectedRoute;