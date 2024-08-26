import { useDeleteSelectedTransactions } from "../../../hooks/transaction/useDeleteSelectedTransactions";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const DeleteSelectedTransactionsForm = ({ handleClose, ids, onHandleEmptyIdSet }: { handleSubmit: any, ids: Set<number>, onHandleEmptyIdSet: any }) => {

    const { accountId: urlId } = useParams<{ accountId: string }>();

    const { isDeleting, deleteSelectedTransactionsMutation } = useDeleteSelectedTransactions();

    function handleSubmit(e: any) {
        e.preventDefault();
        const requestData: DeleteSelectedTransactionsFormData  = {
            transactions: Array.from(ids),
            accountId: Number(urlId)
        }
        // handle delete
        deleteSelectedTransactionsMutation(
            {...requestData},
            {
                onSuccess: () => {
                    handleClose();
                    onHandleEmptyIdSet();
                }
            }
        );
    }




    const submitBtnStyle = "my-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form onSubmit={handleSubmit}>
            <input type="hidden" id="accountId" />
            <input className={submitBtnStyle} disabled={isDeleting} type="submit" value="DELETE" />
        </form>
    );
}

export default DeleteSelectedTransactionsForm;
