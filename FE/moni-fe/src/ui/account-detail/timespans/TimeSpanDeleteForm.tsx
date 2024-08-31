import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Props {
    handleClose: any;
    timeSpanId: number;
};


const TimeSpanDeleteForm = ({ handleClose, timeSpanId }: Props) => {
    const { accountId } = useParams<{ accountId: string }>();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            accountId: accountId
        }
    });

    function onSubmit(data: any) {
        toast.success(`Time span ${timeSpanId} deleted!`);
    }

    const submitBtnStyle = "my-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="accountId" {...register('accountId')} />
            <input className={submitBtnStyle} type="submit" value="DELETE" />
        </form>
    );
}

export default TimeSpanDeleteForm;
