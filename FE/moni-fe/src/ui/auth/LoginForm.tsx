import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/auth/useLogin";
import { CircularProgress } from "@mui/material";

const LoginForm = () => {
    const { register, handleSubmit } = useForm();
    const { loginMutation, isLoggingIn } = useLogin();

    const onSubmit = (data: any) => {
        loginMutation(data);
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="stripe-label" htmlFor="email">Email</label>
                <input className="stripe-input" type="email" id="email" placeholder="you@example.com" {...register('email')} />
            </div>
            <div>
                <label className="stripe-label" htmlFor="password">Password</label>
                <input className="stripe-input" type="password" id="password" placeholder="••••••••" {...register('password')} />
            </div>
            <button
                type="submit"
                disabled={isLoggingIn}
                className="stripe-btn-primary w-full justify-center mt-2"
            >
                {isLoggingIn && <CircularProgress size={14} color="inherit" />}
                Sign in
            </button>
        </form>
    );
}

export default LoginForm;
