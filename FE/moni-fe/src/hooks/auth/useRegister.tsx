import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { RegistrationData } from "../../types/global";

export function useRegister() {
    const nagivate = useNavigate();

    const { isPending: isRegistering, mutate: registerMutation } = useMutation({
        mutationFn: (registrationData: RegistrationData) => register(registrationData),
        onSuccess: (data) => {
            if (data?.status) {
                throw new Error(data.message);
            }
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