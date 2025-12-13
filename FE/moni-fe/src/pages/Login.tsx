import { useNavigate } from "react-router-dom";
import LoginForm from "../ui/auth/LoginForm";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center align-middle mt-10">
            <h1 className="my-10 text-xl tracking-widest">M O N I</h1>
            <LoginForm />
            <div className="my-5">
                Not yet a member? <span className="underline" onClick={() => navigate('/register')}>
                    <a href="#" className="inline-flex items-center font-medium text-fg-brand hover:underline">
                        Register a new account
                    </a>
                </span>
            </div>
        </div>
    );
}

export default Login;