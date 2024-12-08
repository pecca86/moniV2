import { useUser } from "./hooks/auth/useUser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { token } = useUser();
    const navigate = useNavigate();

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