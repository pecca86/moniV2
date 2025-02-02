import { useForm } from "react-hook-form";
import { useAddAccount } from "../../hooks/account/useAddAccount";
import { useUpdateAccount } from "../../hooks/account/useUpdateAccount";
import { Account } from "../../types/global";
import { useUser } from "../../hooks/auth/useUser";

const AccountForm = ({ handleClose = null, update = false, accountData }: { handleClose: any, update: boolean, accountData: Account | undefined }) => {

    // get the query client so we can invalidate the cache
    const { register, handleSubmit, reset, formState } = useForm({
        defaultValues: {
            iban: accountData?.iban,
            name: accountData?.name,
            balance: accountData?.balance,
            savings_goal: accountData?.savings_goal,
            account_type: accountData?.account_type,
            id: accountData?.id
        }
    });

    // capture the errors from our form
    const { errors } = formState;
    const {token} = useUser();

    const { isAdding, addAccountMutation } = useAddAccount(token);
    const { isUpdating, updateAccountMutation } = useUpdateAccount(token);

    const onSubmit = (data: any) => {
        // mutate(data); // let react-query handle the mutation
        if (update) {
            updateAccountMutation(
                { ...data },
                {
                    onSuccess: () => {
                        reset(); // reset the form using react-hook-form
                        handleClose();
                    }
                },
            )
        } else {
            addAccountMutation(
                { ...data },
                {
                    onSuccess: () => {
                        reset(); // reset the form using react-hook-form
                        handleClose();
                    }
                }
            );
        }
    }

    const onError = (errors: any) => {
        // log errors
        console.log(errors);
    }


    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit, onError)}>
            <div className="flex flex-col gap-2">

                <label htmlFor="iban">IBAN</label>
                <input className={inputStyle} type="text" id="iban" {...register('iban', {
                    required: 'IBAN is required',
                    maxLength: {
                        value: 24,
                        message: 'IBAN can be max 24 characters long'
                    },
                })} />

                <span className="text-red-500 ita">{errors?.iban?.message}</span>

                <label htmlFor="name">Name</label>
                <input className={inputStyle} type="text" id="name" {...register('name', {
                    required: 'Account name is required',
                })} />

                <span className="text-red-500 ita">{errors?.name?.message}</span>

                <label htmlFor="balance">Balance</label>
                <input className={inputStyle} type="number" step="0.01" id="balance" {...register('balance', {
                    required: 'Balance is required',
                    max: {
                        value: 999999999999,
                        message: 'Balance must be less than 999999999999'
                    },
                    min: {
                        value: -999999999999,
                        message: 'Balance must be greater than -999999999999'
                    }
                })} />

                <span className="text-red-500 ita">{errors?.balance?.message}</span>

                <label htmlFor="savings_goal">Savings goal</label>
                <input className={inputStyle} type="number" step="0.01" id="savings_goal" {...register('savings_goal', {
                    required: 'Savings goal is required',
                    max: {
                        value: 999999999999,
                        message: 'Balance must be less than 999999999999'
                    },
                    min: {
                        value: 1,
                        message: 'Goal must be greater than 0'
                    }
                })} />

                <span className="text-red-500 ita">{errors?.savings_goal?.message}</span>

                <label htmlFor="account_type">Account type</label>
                <select className={inputStyle} {...register('account_type', {
                    required: 'Account type is required',
                })}>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="SAVINGS">Savings</option>
                    <option value="CREDIT">Credit</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="OTHER">Other</option>
                </select>
                <span className="text-red-500 ita">{errors?.account_type?.message}</span>

                {update && <input value={'id'} type="hidden" {...register('id')} />}

                <input className={submitBtnStyle} disabled={isAdding || isUpdating} type="submit" value="submit" />
            </div>
        </form>
    );
}

export default AccountForm;
