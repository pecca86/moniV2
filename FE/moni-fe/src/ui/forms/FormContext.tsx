import { createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { ReactNode } from "react";

interface MoniLabelProps {
    htmlFor: string;
    label: string;
}

interface MoniSubmitProps {
    ctaText: string;
}

interface MoniInputProps {
    type: string;
    validation?: object;
    id: string;
    name: string;
    placeholder?: string;
}

const FormContext = createContext<{
    register: ReturnType<typeof useForm>["register"];
    errors: ReturnType<typeof useForm>["formState"]["errors"];
}>({
    register: (name) => ({ name, onBlur: async () => {}, onChange: async () => {}, ref: () => {} }),
    errors: {}
});

interface MoniFormProps {
    children: ReactNode;
    formHook: (data: any) => void;
}

function MoniForm({ children, formHook }: MoniFormProps) {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    const onSubmit = (data: any) => {
        if (!data.email || !data.firstname || !data.lastname || !data.password || !data.password2) {
            toast.error('All fields are required');
            return;
        }
        if (data.password !== data.password2) {
            toast.error('Passwords do not match');
            return;
        }
        formHook(data);
    }

    return (
        <FormContext.Provider value={{ register, errors }}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                {children}
            </form>
        </FormContext.Provider>
    )
}

function MoniInput({ type, validation = {}, id, name = "", placeholder = "" }: MoniInputProps) {
    console.log(name);
    const { register, errors } = useContext(FormContext);
    return (
        <>
            <input className="stripe-input" type={type} id={id} placeholder={placeholder} {...register(id, validation)} />
            {errors?.name?.message && <span className="stripe-error">{String(errors.name.message)}</span>}
        </>
    )
}

function MoniLabel({ htmlFor, label }: MoniLabelProps) {
    return (
        <label className="stripe-label" htmlFor={htmlFor}>{label}</label>
    )
}

function MoniSubmit({ ctaText }: MoniSubmitProps) {
    return (
        <input className="stripe-btn-primary w-full justify-center mt-2 cursor-pointer" type="submit" value={ctaText} />
    )
}

MoniForm.MoniInput = MoniInput;
MoniForm.MoniSubmit = MoniSubmit;
MoniForm.MoniLabel = MoniLabel;

export default MoniForm;
