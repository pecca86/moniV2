import { useNavigate } from "react-router-dom";
import LoginForm from "../ui/auth/LoginForm";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col justify-center items-center align-middle mt-10">
            <h1 className="my-10 text-xl tracking-widest">M O N I</h1>
            <LoginForm />
            <div className="my-5">
                Not yet a member? <span className="underline" onClick={() => navigate('/register')}>Register a new account!</span>
            </div>
        </div>
    );
}

export default Login;
