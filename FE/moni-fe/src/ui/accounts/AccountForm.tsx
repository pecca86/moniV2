import { useForm } from "react-hook-form";
import { useAddAccount } from "../../hooks/account/useAddAccount";
import { useUpdateAccount } from "../../hooks/account/useUpdateAccount";

const AccountForm = ({ handleClose, update = false, accountData }: { handleClose: any, update: boolean, accountData: Account | undefined }) => {

    // get the query client so we can invalidate the cache
    const { register, handleSubmit, reset } = useForm();

    const { isAdding, addAccountMutation } = useAddAccount();
    const { isUpdating, updateAccountMutation } = useUpdateAccount();

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
                }
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


    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">

                <label htmlFor="iban">IBAN</label>
                <input value={accountData && accountData?.iban} className={inputStyle} type="text" id="iban" {...register('iban')} />

                <label htmlFor="name">Name</label>
                <input value={accountData && accountData?.name} className={inputStyle} type="text" id="name" {...register('name')} />

                <label htmlFor="balance">Balance</label>
                <input value={accountData && accountData?.balance} className={inputStyle} type="number" step="0.01" id="balance" {...register('balance')} />

                <label htmlFor="savings_goal">Savings goal</label>
                <input value={accountData && accountData?.savings_goal} className={inputStyle} type="number" step="0.01" id="savings_goal" {...register('savings_goal')} />

                <label htmlFor="account_type">Account type</label>
                <select value={accountData && accountData?.account_type} className={inputStyle} {...register('account_type')}>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="SAVINGS">Savings</option>
                    <option value="CREDIT">Credit</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="OTHER">Other</option>
                </select>

                {update && <input value={'dd'} type="hidden" {...register('id')} />}

                <input className={submitBtnStyle} disabled={isAdding || isUpdating} type="submit" value="submit" />
            </div>
        </form>
    );
}

export default AccountForm;
