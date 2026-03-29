import { useDeleteSelectedTransactions } from "../../../hooks/transaction/useDeleteSelectedTransactions";
import { useParams } from "react-router-dom";
import { DeleteSelectedTransactionsFormData } from "../../../types/global";
import { useUser } from "../../../hooks/auth/useUser";

const DeleteSelectedTransactionsForm = ({ handleClose, ids, onHandleEmptyIdSet }: { handleClose: any, ids: Array<number>, onHandleEmptyIdSet: any }) => {
    const { accountId: urlId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const { isDeleting, deleteSelectedTransactionsMutation } = useDeleteSelectedTransactions(token);

    function handleSubmit(e: any) {
        e.preventDefault();
        const requestData: DeleteSelectedTransactionsFormData = {
            transactions: Array.from(ids),
            accountId: Number(urlId)
        }
        deleteSelectedTransactionsMutation(
            { ...requestData },
            {
                onSuccess: () => {
                    handleClose();
                    onHandleEmptyIdSet();
                }
            }
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" id="accountId" />
            <input className="stripe-btn-danger cursor-pointer" disabled={isDeleting} type="submit" value="Delete" />
        </form>
    );
}

export default DeleteSelectedTransactionsForm;
