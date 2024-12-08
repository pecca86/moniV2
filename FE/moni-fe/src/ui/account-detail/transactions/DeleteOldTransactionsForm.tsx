import { useParams } from "react-router-dom";
import { useDeleteOldTransactions } from "../../../hooks/transaction/useDeleteOldTransactions";
import { useForm } from "react-hook-form";

const DeleteOldTransactionsForm = ({ handleClose }: { handleClose: any }) => {

    const { accountId } = useParams<{ accountId: string }>();
    const { deleteOldTransactionsMutation } = useDeleteOldTransactions(accountId);
    const { handleSubmit }  = useForm();


    function onSubmit(data: any) {
        deleteOldTransactionsMutation(
            { ...data },
            {
                onSuccess: () => {
                    handleClose();
                }
            }
        )

    }

    const submitBtnStyle = "my-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" id="accountId" />
            <input className={submitBtnStyle} type="submit" value="DELETE" />
        </form>
    );
}

export default DeleteOldTransactionsForm;
