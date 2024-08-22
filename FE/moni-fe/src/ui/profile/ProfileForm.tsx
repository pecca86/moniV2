import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const ProfileForm = ({ handleClose }: any) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        handleClose();
        toast.success('Account added successfully');
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstname">Firstname</label>
            <input type="text" id="firstname" {...register('firstname')} />

            <label htmlFor="lastname">Lastname</label>
            <input type="text" id="lastname" {...register('lastname')} />

            <input type="submit" value="submit" />
        </form>
    );
}

export default ProfileForm;
