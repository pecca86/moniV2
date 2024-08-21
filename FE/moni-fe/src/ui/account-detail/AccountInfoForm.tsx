import { useForm } from "react-hook-form";
import toast from "react-hot-toast";


const AccountInfoForm = ({ handleClose }: any) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log('submitted: ', data);
        handleClose();
        toast.success('Account info updated successfully');
    }

    return (
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="IBAN">IBAN</label>
            <input type="text" id="IBAN" {...register('IBAN')} />

            <label htmlFor="balance">Balance</label>
            <input type="number" id="balance" {...register('balance')} />

            <label htmlFor="type">Account type</label>
            <input type="text" id="type" {...register('type')} />

            <input type="submit" value="submit" />
        </form>
    );
}

export default AccountInfoForm;
