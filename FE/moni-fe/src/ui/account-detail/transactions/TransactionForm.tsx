import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAddTransaction } from "../../../hooks/transaction/useAddTransaction";
import { useAddMonthlyTransaction } from "../../../hooks/transaction/useAddMonthlyTransaction";
import { useUpdateSingleTransaction } from "../../../hooks/transaction/useUpdateSingleTransaction";
import { useUpdateSelectedTransactions } from "../../../hooks/transaction/useUpdateSelectedTransactions";
import { useParams } from "react-router-dom";
import { useState } from "react";
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import { Transaction } from "../../../types/global";
import { useUser } from "../../../hooks/auth/useUser";

type Props = {
    handleClose: any;
    ids?: number[];
    transactionData?: Transaction;
    mode: string;
};

const TransactionForm = ({ handleClose, ids, transactionData = undefined, mode = 'none' }: Props) => {
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const [hidden, toggleHidden] = useState(true);
    const [months, setMonths] = useState(1);

    let validatedSum: number | undefined;
    if (transactionData) {
        validatedSum = transactionData?.sum < 0 ? transactionData.sum * -1 : transactionData.sum;
    }

    const { register, handleSubmit, formState } = useForm({
        defaultValues: {
            sum: validatedSum || '',
            description: transactionData?.description || '',
            transaction_category: transactionData?.transaction_category || '',
            transaction_type: transactionData?.transaction_type || '',
            transaction_date: transactionData?.transaction_date || new Date().toISOString().split('T')[0],
            accountId: accountId
        }
    });

    const { errors } = formState;
    const { isAdding, addTransactionMutation } = useAddTransaction(token);
    const { isAddingMonthly, addMonthlyTransactionMutation } = useAddMonthlyTransaction(token);
    const { isUpdating, updateTransactionMutation } = useUpdateSingleTransaction(token);
    const { isUpdatingTransactions, updateSelectedTransactionMutation } = useUpdateSelectedTransactions(token);

    function handleAddTransaction(data: any) {
        if (hidden) {
            addTransactionMutation({ ...data }, {
                onSuccess: () => { toast.success('Transaction added'); handleClose(); }
            });
        } else {
            addMonthlyTransactionMutation({ transactionData: { ...data }, months }, {
                onSuccess: () => { toast.success(`${months} transactions added`); handleClose(); }
            });
        }
    }

    function handleUpdateSingleTransaction(data: any) {
        updateTransactionMutation({ ...data, id: transactionData?.id }, {
            onSuccess: () => { toast.success('Transaction updated'); handleClose(); }
        });
    }

    function handleUpdateSelectedTransactions(data: any) {
        updateSelectedTransactionMutation(
            { ...data, transactionIds: ids ? Array.from(ids) : [] },
            { onSuccess: () => { toast.success('Transactions updated'); handleClose(); } }
        );
    }

    const onSubmit = (data: any) => {
        switch (mode) {
            case 'add': handleAddTransaction(data); break;
            case 'edit': handleUpdateSingleTransaction(data); break;
            case 'edit-many': handleUpdateSelectedTransactions(data); break;
            default: toast.error('Error in form submission');
        }
    }

    const validateDate = (value: any) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today || "Selected date cannot be in the past";
    };

    const validateSum = (value: any) => value > 0 || "Sum should be greater than 0";

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="stripe-label">Sum</label>
                <input className="stripe-input" type="number" step="0.01" {...register('sum', {
                    required: 'Sum is required',
                    validate: validateSum
                })} />
                {errors?.sum?.message && <span className="stripe-error">{String(errors.sum.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Description</label>
                <input className="stripe-input" type="text" {...register('description', { required: 'Description is required' })} />
                {errors?.description?.message && <span className="stripe-error">{String(errors.description.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Category</label>
                <select className="stripe-input" {...register('transaction_category', { required: 'Category is required' })}>
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
                    <option value="MORTAGE">Mortgage</option>
                    <option value="CLOTHES">Clothes</option>
                    <option value="RENT">Rent</option>
                    <option value="RESTAURANTS">Restaurants</option>
                    <option value="OTHER">Other</option>
                </select>
                {errors?.transaction_category?.message && <span className="stripe-error">{String(errors.transaction_category.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Type</label>
                <select className="stripe-input" {...register('transaction_type', { required: 'Type is required' })}>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="WITHDRAWAL">Withdrawal</option>
                </select>
                {errors?.transaction_type?.message && <span className="stripe-error">{String(errors.transaction_type.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Date</label>
                <input className="stripe-input" type="date" {...register('transaction_date', {
                    required: 'Date is required',
                    validate: validateDate
                })} />
                {errors?.transaction_date?.message && <span className="stripe-error">{String(errors.transaction_date.message)}</span>}
            </div>

            {mode !== 'edit-many' && (
                <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-[#3C4257] cursor-pointer">
                        <Checkbox
                            onClick={(e: any) => toggleHidden(!e.target.checked)}
                            size="small"
                            sx={{ color: '#E3E8EF', '&.Mui-checked': { color: '#635BFF' }, padding: 0 }}
                        />
                        Repeat for multiple months
                    </label>
                    {!hidden && (
                        <div className="px-2">
                            <p className="text-xs text-[#697386] mb-2">Months: {months}</p>
                            <Slider
                                defaultValue={1}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={1}
                                max={12}
                                onChange={(_e, value) => setMonths(value as number)}
                                sx={{ color: '#635BFF' }}
                            />
                        </div>
                    )}
                </div>
            )}

            <input type="hidden" value={accountId} {...register('accountId')} />
            <input
                className="stripe-btn-primary w-full justify-center mt-2 cursor-pointer"
                disabled={isAdding || isAddingMonthly || isUpdating || isUpdatingTransactions}
                type="submit"
                value="Save"
            />
        </form>
    );
}

export default TransactionForm;
