import { useForm } from "react-hook-form";
import { useDeleteAccount } from "../../hooks/account/useDeleteAccount";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/auth/useUser";

const AccountDeleteForm = ({ handleClose }: any) => {
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            accountId: accountId
        }
    });
    const { isDeleting, deleteAccountMutation } = useDeleteAccount(accountId, token);
    const navigate = useNavigate();

    const onSubmit = (data: any) => {
        deleteAccountMutation(
            { ...data },
            {
                onSuccess: () => {
                    handleClose();
                    navigate('/accounts');
                }
            }
        )
    }

    const submitBtnStyle = "my-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="accountId" {...register('accountId')} />
            <input className={submitBtnStyle} disabled={isDeleting} type="submit" value="DELETE" />
        </form>
    );
}

export default AccountDeleteForm;
