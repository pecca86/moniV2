import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const AccountForm = ({ handleClose }: any) => {

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        handleClose();
        toast.success('Account added successfully');
    }

    const inputStyle = "block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
    const submitBtnStyle = "mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">

                <label htmlFor="firstname">IBAN</label>
                <input className={inputStyle} type="text" id="firstname" {...register('iban')} />

                <label htmlFor="lastname">Name</label>
                <input className={inputStyle} type="text" id="lastname" {...register('name')} />

                <label htmlFor="balance">Balance</label>
                <input className={inputStyle} type="number" id="balance" {...register('balance')} />

                <label htmlFor="savings_goal">Savings goal</label>
                <input className={inputStyle} type="number" id="savings_goal" {...register('savings_goal')} />

                <label htmlFor="account_type">Account type</label>
                <select className={inputStyle} {...register('account_type')}>
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                </select>


                <input className={submitBtnStyle} type="submit" value="submit" />
            </div>
        </form>
    );
}

export default AccountForm;
