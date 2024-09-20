import { useForm } from "react-hook-form";
import { useLogin } from "../../hooks/auth/useLogin";
import { CircularProgress } from "@mui/material";

const LoginForm = () => {
    const { register, handleSubmit } = useForm();
    const { loginMutation, isLoggingIn } = useLogin();

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        loginMutation(data);
    }

    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

    if (isLoggingIn) {
        <div className="flex flex-col justify-center items-center mt-10">
            <h1 className="mt-10">Logging in...</h1>
            <CircularProgress />
        </div>
    }
    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input className={inputStyle} type="email" id="email" {...register('email')} />

            <label htmlFor="password">Password</label>
            <input className={inputStyle} type="password" id="password" {...register('password')} />

            <input className={submitBtnStyle} type="submit" value="submit" />
        </form>
    );
}

export default LoginForm;