import { useForm } from "react-hook-form";
import { useCreateTimeSpan } from "../../../hooks/timespan/useCreateTimeSpan";
import { useParams } from "react-router-dom";
import { useUser } from "../../../hooks/auth/useUser";

const TimeSpanForm = ({ handleClose }: any) => {
    const { token } = useUser();
    const { register, handleSubmit, formState, getValues } = useForm();
    const { isAdding, createTimeSpanMutation } = useCreateTimeSpan(token);
    const { accountId } = useParams<{ accountId: string }>();
    const { errors } = formState;

    const onSubmit = (data: any) => {
        createTimeSpanMutation({ ...data }, { onSuccess: () => { handleClose(); } });
    }

    function validateToDate(date: string) {
        return new Date(getValues().from) < new Date(date);
    }

    function validateFromDate(value: string) {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="stripe-label">Start date</label>
                <input className="stripe-input" type="date" {...register('from', {
                    required: "This field is required",
                    validate: (v) => validateFromDate(v) || "Date must be present or future"
                })} />
                {typeof errors?.from?.message === 'string' && <span className="stripe-error">{errors.from.message}</span>}
            </div>

            <div>
                <label className="stripe-label">End date</label>
                <input className="stripe-input" type="date" {...register("to", {
                    required: "This field is required",
                    validate: (v) => validateToDate(v) || "End date must be after start date"
                })} />
                {typeof errors?.to?.message === 'string' && <span className="stripe-error">{errors.to.message}</span>}
            </div>

            <input type="hidden" value={accountId} {...register('accountId')} />
            <input className="stripe-btn-primary w-full justify-center cursor-pointer" disabled={isAdding} type="submit" value="Create time span" />
        </form>
    );
}

export default TimeSpanForm;
