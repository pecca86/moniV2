import { useForm } from "react-hook-form";
import { useCreateTimeSpan } from "../../../hooks/timespan/useCreateTimeSpan";
import { useParams } from "react-router-dom";

const TimeSpanForm = ({ handleClose }: any) => {
    const { register, handleSubmit, formState, getValues } = useForm();
    const { isAdding, createTimeSpanMutation } = useCreateTimeSpan();
    const { accountId } = useParams<{ accountId: string }>();
    const { errors } = formState;

    const onSubmit = (data: any) => {
        createTimeSpanMutation(
            { ...data },
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        );
    }

    function validateToDate(date: string) {
        const fromDate = new Date(getValues().from);
        const toDate = new Date(date);
        return fromDate < toDate;
    }

    function validateFromDate(value: string) {
        const selectedDate = new Date(value);
        const today = new Date();
        // Set the time of today's date to 00:00:00 to compare only the date part
        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
    }

    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstname">Start date</label>
            <input className={inputStyle}
                type="date"
                id="from"
                {...register('from', {
                    required: "This field is required",
                    validate: (value) => validateFromDate(value) || "Date must be present or future"
                })}
            />
            <span className="text-red-500 ita">{typeof errors?.from?.message === 'string' ? errors.from.message : ''}</span>

            <label htmlFor="lastname">End date</label>
            <input className={inputStyle}
                type="date"
                id="to"
                {...register("to", {
                    required: "This field is required",
                    validate: (value) => validateToDate(value) || "End date must be after start date"
                })}
            />
            <span className="text-red-500 ita">{typeof errors?.to?.message === 'string' ? errors.to.message : ''}</span>

            <input type="hidden" value={accountId} {...register('accountId')} />

            <input className={submitBtnStyle} disabled={isAdding} type="submit" value="submit" />
        </form>
    );
}

export default TimeSpanForm;
