import { useForm } from "react-hook-form";
import { useAddAccount } from "../../hooks/account/useAddAccount";
import { useUpdateAccount } from "../../hooks/account/useUpdateAccount";
import { Account } from "../../types/global";
import { useUser } from "../../hooks/auth/useUser";

const AccountForm = ({ handleClose = null, update = false, accountData }: { handleClose: any, update: boolean, accountData: Account | undefined }) => {
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

    const { errors } = formState;
    const { token } = useUser();
    const { isAdding, addAccountMutation } = useAddAccount(token);
    const { isUpdating, updateAccountMutation } = useUpdateAccount(token);

    const onSubmit = (data: any) => {
        if (update) {
            updateAccountMutation({ ...data }, {
                onSuccess: () => { reset(); handleClose(); }
            });
        } else {
            addAccountMutation({ ...data }, {
                onSuccess: () => { reset(); handleClose(); }
            });
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label className="stripe-label">IBAN</label>
                <input className="stripe-input" type="text" {...register('iban', {
                    required: 'IBAN is required',
                    maxLength: { value: 24, message: 'IBAN max 24 characters' }
                })} />
                {errors?.iban?.message && <span className="stripe-error">{String(errors.iban.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Name</label>
                <input className="stripe-input" type="text" {...register('name', { required: 'Account name is required' })} />
                {errors?.name?.message && <span className="stripe-error">{String(errors.name.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Balance</label>
                <input className="stripe-input" type="number" step="0.01" {...register('balance', {
                    required: 'Balance is required',
                    max: { value: 999999999999, message: 'Balance too large' },
                    min: { value: -999999999999, message: 'Balance too small' }
                })} />
                {errors?.balance?.message && <span className="stripe-error">{String(errors.balance.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Savings goal</label>
                <input className="stripe-input" type="number" step="0.01" {...register('savings_goal', {
                    required: 'Savings goal is required',
                    max: { value: 999999999999, message: 'Value too large' },
                    min: { value: 1, message: 'Goal must be greater than 0' }
                })} />
                {errors?.savings_goal?.message && <span className="stripe-error">{String(errors.savings_goal.message)}</span>}
            </div>

            <div>
                <label className="stripe-label">Account type</label>
                <select className="stripe-input" {...register('account_type', { required: 'Account type is required' })}>
                    <option value="DEPOSIT">Deposit</option>
                    <option value="SAVINGS">Savings</option>
                    <option value="CREDIT">Credit</option>
                    <option value="INVESTMENT">Investment</option>
                    <option value="OTHER">Other</option>
                </select>
                {errors?.account_type?.message && <span className="stripe-error">{String(errors.account_type.message)}</span>}
            </div>

            {update && <input value={'id'} type="hidden" {...register('id')} />}

            <input
                className="stripe-btn-primary w-full justify-center mt-2 cursor-pointer"
                disabled={isAdding || isUpdating}
                type="submit"
                value="Save"
            />
        </form>
    );
}

export default AccountForm;
