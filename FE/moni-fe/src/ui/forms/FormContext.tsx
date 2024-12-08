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

// 1. Create context
const FormContext = createContext<{
    register: ReturnType<typeof useForm>["register"];
    errors: ReturnType<typeof useForm>["formState"]["errors"];
}>({
    register: (name) => ({ name, onBlur: async () => {}, onChange: async () => {}, ref: () => {} }),
    errors: {}
});


const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
const inputStyle = "block my-2 w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

// 2. Create Parent component

interface MoniFormProps {
    children: ReactNode;
    formHook: (data: any) => void;
}

function MoniForm({ children, formHook }: MoniFormProps) {

    // React Form specific
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;

    const onSubmit = (data: any) => {
        if ( !data.email || !data.firstname || !data.lastname || !data.password || !data.password2) {
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
            <form onSubmit={handleSubmit(onSubmit)}>
                {children}
            </form>
        </FormContext.Provider>
    )
}

// 3. Create child components
function MoniInput({ type, validation = {}, id, name = "", placeholder = "" }: MoniInputProps) {
    console.log(name);
    const { register, errors } = useContext(FormContext);
    return (
        <>
            <input className={inputStyle} type={type} id={id} placeholder={placeholder} {...register(id, validation)} />
            {errors?.name?.message && <span className="text-red-500 ita">{String(errors.name.message)}</span>}
        </>
    )
}

function MoniLabel({ htmlFor, label }: MoniLabelProps) {
    return (
        <label htmlFor={htmlFor}>{label}</label>
    )
}



function MoniSubmit({ ctaText }: MoniSubmitProps) {
    return (
        <input className={submitBtnStyle} type="submit" value={ctaText} />
    )
}

// 4. Add childrens as props to parent
MoniForm.MoniInput = MoniInput;
MoniForm.MoniSubmit = MoniSubmit;
MoniForm.MoniLabel = MoniLabel;

export default MoniForm;