import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const TimeSpanForm = ({handleClose}: any) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        handleClose();
        toast.success('Account added successfully');
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstname">Start date</label>
            <input type="date" id="startDate" {...register('startDate')} />

            <label htmlFor="lastname">End date</label>
            <input type="date" id="endDate" {...register('endDate')}/>

            <input type="submit" value="submit" />
        </form>
    );
}

export default TimeSpanForm;
