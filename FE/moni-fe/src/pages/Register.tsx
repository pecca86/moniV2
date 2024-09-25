import { useNavigate } from "react-router-dom";
import MoniForm from "../ui/forms/FormContext";
import { useRegister } from "../hooks/auth/useRegister";

{ required: 'Account name is required' }

const Register = () => {
    const navigate = useNavigate();
    const { registerMutation } = useRegister();

    return (
        <div className="flex flex-col justify-center items-center align-middle mt-10">
            <h1 className="my-10 text-xl tracking-widest">Register a new account</h1>
            {/* <LoginForm /> */}
            <MoniForm formHook={registerMutation}>
                <MoniForm.MoniLabel htmlFor="email" label="Email" />
                <MoniForm.MoniInput type="text" validationMsg={{ required: 'Email is required' }} id="email" name="email" placeholder="example@ex.com" />
                <MoniForm.MoniLabel htmlFor="firstname" label="First name" />
                <MoniForm.MoniInput type="text" validationMsg={{ required: 'First name is required' }} id="firstname" name="firstname" placeholder="First name" />
                <MoniForm.MoniLabel htmlFor="lastname" label="Last name" />
                <MoniForm.MoniInput type="text" validationMsg={{ required: 'Last name is required' }} id="lastname" name="lastname" placeholder="Last name" />
                <MoniForm.MoniLabel htmlFor="password" label="Password" />
                <MoniForm.MoniInput type="password" validationMsg={{ required: 'Password is required' }} id="password" name="password" />
                <MoniForm.MoniLabel htmlFor="password2" label="Confirm password" />
                <MoniForm.MoniInput type="password" validationMsg={{ required: 'Password confirmation is required' }} id="password2" name="password2" />
                <MoniForm.MoniSubmit ctaText="Register" />
            </MoniForm>
            <div className="my-5">
                Already a member? <span className="underline" onClick={() => navigate('/login')}>Back to login.</span>
            </div>
        </div>
    );
}

export default Register;