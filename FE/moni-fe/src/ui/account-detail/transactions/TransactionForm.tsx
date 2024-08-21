import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const TransactionForm = ({handleClose}: any) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        handleClose();
        toast.success('Transaction added successfully');
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="firstname">Transaction Type</label>
            <input type="text" id="type" {...register('type')} />

            <label htmlFor="lastname">Amount</label>
            <input type="number" id="amount" {...register('amount')}/>

            <input type="submit" value="submit" />
        </form>
    );
}

export default TransactionForm;
