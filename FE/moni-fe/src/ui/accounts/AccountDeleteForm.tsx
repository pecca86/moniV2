import { useForm } from "react-hook-form";
import { useDeleteAccount } from "../../hooks/account/useDeleteAccount";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/auth/useUser";

const AccountDeleteForm = ({ handleClose }: any) => {
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const { register, handleSubmit } = useForm({
        defaultValues: { accountId: accountId }
    });
    const { isDeleting, deleteAccountMutation } = useDeleteAccount(accountId, token);
    const navigate = useNavigate();

    const onSubmit = (data: any) => {
        deleteAccountMutation(
            { ...data },
            { onSuccess: () => { handleClose(); navigate('/accounts'); } }
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="accountId" {...register('accountId')} />
            <input className="stripe-btn-danger cursor-pointer" disabled={isDeleting} type="submit" value="Delete account" />
        </form>
    );
}

export default AccountDeleteForm;
