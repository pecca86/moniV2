import { useParams } from "react-router-dom";
import { useDeleteOldTransactions } from "../../../hooks/transaction/useDeleteOldTransactions";
import { useForm } from "react-hook-form";
import { useUser } from "../../../hooks/auth/useUser";

const DeleteOldTransactionsForm = ({ handleClose }: { handleClose: any }) => {
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const { deleteOldTransactionsMutation } = useDeleteOldTransactions(accountId, token);
    const { handleSubmit } = useForm();

    function onSubmit(data: any) {
        deleteOldTransactionsMutation(
            { ...data },
            { onSuccess: () => { handleClose(); } }
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="accountId" />
            <input className="stripe-btn-danger cursor-pointer" type="submit" value="Delete" />
        </form>
    );
}

export default DeleteOldTransactionsForm;
