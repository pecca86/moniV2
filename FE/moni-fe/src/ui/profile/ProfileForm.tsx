import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ProfileForm = ({ handleClose, user }: { handleClose: any, user: any }) => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            firstname: user?.first_name,
            lastname: user?.last_name
        }
    });

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        handleClose();
        toast.success('Account added successfully');
    }

    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstname">Firstname</label>
            <input className={inputStyle} type="text" id="firstname" {...register('firstname')} />

            <label htmlFor="lastname">Lastname</label>
            <input className={inputStyle} type="text" id="lastname" {...register('lastname')} />

            <input className={submitBtnStyle} type="submit" value="submit" />
        </form>
    );
}

export default ProfileForm;
