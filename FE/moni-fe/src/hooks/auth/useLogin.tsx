import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { login } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isPending: isLoggingIn, mutate: loginMutation } = useMutation({
        mutationFn: (user) => login(user),
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