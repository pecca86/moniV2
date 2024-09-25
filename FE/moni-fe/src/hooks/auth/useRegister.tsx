import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useRegister() {
    const nagivate = useNavigate();

    const { isPending: isRegistering, mutate: registerMutation } = useMutation({
        mutationFn: (registrationData) => register(registrationData),
        onSuccess: (data) => {
            console.log("HOOK DATA", data)
            // localStorage.removeItem('token');
            localStorage.setItem('token', data.token);
            toast.success("Welcome to M O N I !")
            nagivate('/accounts')
        },
        onError: (err) => {
            toast.error(err.message);
        }
    })

    return { isRegistering, registerMutation };
}