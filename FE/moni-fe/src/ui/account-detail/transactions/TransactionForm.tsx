import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddTransaction } from "../../../hooks/transaction/useAddTransaction";
import { useAddMonthlyTransaction } from "../../../hooks/transaction/useAddMonthlyTransaction";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import { Transaction } from "../../../types/global";

const TransactionForm = ({ handleClose, ids, transactionData = undefined}: { handleClose: any, ids?: Array<number>, transactionData?: Transaction | undefined }) => {
    const { accountId } = useParams<{ accountId: string }>();
    const [hidden, toggleHidden] = useState(true);
    const [months, setMonths] = useState(1);

    const { register, handleSubmit, formState } = useForm({
        defaultValues: {
            sum: transactionData?.sum || '',
            description: transactionData?.description || '',
            transaction_category: transactionData?.transaction_category || '',
            transaction_type: transactionData?.transaction_type || '',
            transaction_date: transactionData?.transaction_date || new Date().toISOString().split('T')[0],
            accountId: accountId
        }
    });

    const { errors } = formState;

    const { isAdding, addTransactionMutation } = useAddTransaction();
    const { isAddingMonthly, addMonthlyTransactionMutation } = useAddMonthlyTransaction();

    const onSubmit = (data: any) => {
        if (hidden) {
            addTransactionMutation(
                { ...data },
                {
                    onSuccess: () => {
                        toast.success('Transaction added successfully');
                        handleClose();
                    }
                }
            );
        } else {
            addMonthlyTransactionMutation(
                { transactionData: { ...data }, months: months },
                {
                    onSuccess: () => {
                        toast.success(`${months} transactions added successfully`);
                        handleClose();
                    }
                }
            );
        }
    }

    const onError = (errors: any) => {
        // log errors
    }

    const validateDate = (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        // Set the time of today's date to 00:00:00 to compare only the date part
        today.setHours(0, 0, 0, 0);

        return selectedDate >= today || "Selected date cannot be in the past";
    };

    const onToggleMonths = (e) => {
        toggleHidden(!e.target.checked);
    }

    const onMonthsChange = (months: number) => {
        setMonths(months);
    }

    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col gap-2">

                {/* SUM */}
                <label htmlFor="sum">Sum</label>
                <input className={inputStyle} type="number" id="sum" step="0.01" {...register('sum', {
                    required: 'Sum is required',
                    min: 0
                })} />

                <span className="text-red-500 ita">{errors?.sum?.message}</span>

                {/* DESCRIPTION */}
                <label htmlFor="description">Description</label>
                <input className={inputStyle} type="text" id="description" {...register('description', {
                    required: 'Description is required',
                })} />

                <span className="text-red-500 ita">{errors?.description?.message}</span>

                {/* CATEGORY */}
                <label htmlFor="transaction_category">Transaction category</label>
                <select className={inputStyle} {...register('transaction_category', {
                    required: 'Transaction Category type is required',
                })}>
                    <option value="SAVINGS">Savings</option>
                    <option value="FOOD">Food</option>
                    <option value="TRANSPORTATION">Transportation</option>
                    <option value="ENTERTAINMENT">Entertainment</option>
                    <option value="HOBBIES">Hobbies</option>
                    <option value="UTILITIES">Utilities</option>
                    <option value="HEALTH">Health</option>
                    <option value="HOME">Home</option>
                    <option value="KIDS">Kids</option>
                    <option value="TRAVEL">Travel</option>
                    <option value="SALARY">Salary</option>
                    <option value="BILLS">Bills</option>
                    <option value="MORTAGE">Mortage</option>
                    <option value="CLOTHES">Clothes</option>
                    <option value="RENT">Rent</option>
                    <option value="RESTAURANTS">Restaurants</option>
                    <option value="OTHER">Other</option>
                </select>
                <span className="text-red-500 ita">{errors?.transaction_category?.message}</span>

                {/* TYPE */}
                <label htmlFor="transaction_type">Transaction type</label>
                <select className={inputStyle} {...register('transaction_type', {
                    required: 'Transaction Type type is required',
                })}>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="WITHDRAWAL">Withdrawal</option>
                </select>
                <span className="text-red-500 ita">{errors?.transaction_type?.message}</span>

                {/* DATE */}
                <label htmlFor="transaction_date">Date</label>
                <input className={inputStyle} type="date" id="transaction_date" {...register('transaction_date', {
                    required: 'Date is required',
                    validate: (value) => validateDate(value)
                })} />
                <span className="text-red-500 ita">{errors?.transaction_date?.message}</span>

                {/* MONTHS */}
                <div>
                    <label htmlFor="toggleMonth">Create for time period (months)</label>
                    {/* <input onClick={(e) => onToggleMonths(e)} type="checkbox" name="toggleMonth" id="toggleMonth" /> */}
                    <Checkbox onClick={(e) => onToggleMonths(e)} />
                </div>

                <Slider
                    sx={{ display: hidden ? 'none' : 'block' }}
                    aria-label="Temperature"
                    defaultValue={1}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={12}
                    onChange={(e, value) => onMonthsChange(value)}
                />
                {/* ACCOUNT ID */}
                <input value={accountId} type="hidden" {...register('accountId')} />

                <input className={submitBtnStyle} disabled={isAdding || isAddingMonthly} type="submit" value="submit" />
            </div>
        </form>
    );
}

export default TransactionForm;
