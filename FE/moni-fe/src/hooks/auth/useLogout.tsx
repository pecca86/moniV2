import { replace, useNavigate } from "react-router-dom";

export function useLogout() {
    const naviggate = useNavigate();
    const logout = () => {
        localStorage.removeItem('token');
        naviggate('/login', { replace: true }); // replace = true erases back button history
    };

    return { logout };
}