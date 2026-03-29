import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useDeleteTimeSpan } from "../../../hooks/timespan/useDeleteTimeSpan";
import { useUser } from "../../../hooks/auth/useUser";

interface Props {
    handleClose: any;
    timeSpanId: number;
}

const TimeSpanDeleteForm = ({ handleClose, timeSpanId }: Props) => {
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const { register, handleSubmit } = useForm({ defaultValues: { accountId } });
    const { deleteTimeSpanMutation } = useDeleteTimeSpan(accountId, timeSpanId, token);

    function onSubmit(data: any) {
        deleteTimeSpanMutation({ ...data }, { onSuccess: () => { handleClose(); } });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="accountId" {...register('accountId')} />
            <input className="stripe-btn-danger cursor-pointer" type="submit" value="Delete time span" />
        </form>
    );
}

export default TimeSpanDeleteForm;
