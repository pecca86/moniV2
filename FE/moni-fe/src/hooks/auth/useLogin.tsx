import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/global";

export function useLogin() {
    const navigate = useNavigate();

    const { isPending: isLoggingIn, mutate: loginMutation } = useMutation({
        mutationFn: (user: User) => login(user),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            toast.success('Welcome back!');
            navigate('/accounts')
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });
    return { isLoggingIn, loginMutation };
}