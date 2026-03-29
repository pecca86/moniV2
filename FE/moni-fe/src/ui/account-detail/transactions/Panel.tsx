import AddModal from "../../cta/AddModal";
import AccountForm from "../../accounts/AccountForm";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFetchAccount } from "../../../hooks/account/useFetchAccount";
import { useParams } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import MoniBanner from "../../banners/MoniBanner";
import AccountDeleteForm from "../../accounts/AccountDeleteForm";
import { useUser } from "../../../hooks/auth/useUser";

const Panel = () => {
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();
    const { isPending, account, error } = useFetchAccount(accountId as string, token);

    if (isPending) {
        return <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '12px' }} />;
    }

    if (!isPending && error) {
        return <MoniBanner style="warning">There was a problem fetching the account data, please try again later!</MoniBanner>;
    }

    if (account?.status === "NOT_FOUND") {
        return <MoniBanner style="warning">Account not found!</MoniBanner>;
    }

    return (
        <div className="stripe-card">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-[#1A1F36]">Account details</h2>
                <div className="flex gap-2">
                    <AddModal
                        ctaText=""
                        heading="Update account info"
                        paragraph="Edit the fields below"
                        form={<AccountForm update={true} accountData={account} handleClose={undefined} />}
                        buttonIcon={<EditIcon fontSize="small" />}
                        ctaStyle="secondary"
                    />
                    <AddModal
                        ctaText=""
                        heading="Delete account"
                        paragraph="Are you sure you want to delete this account and all related transactions?"
                        form={<AccountDeleteForm />}
                        buttonIcon={<DeleteIcon fontSize="small" />}
                        ctaStyle="bg-red-500"
                    />
                </div>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <dt className="text-[#697386]">Balance</dt>
                <dd className="text-[#1A1F36] font-semibold text-right">{account?.balance} €</dd>

                <dt className="text-[#697386]">With transactions</dt>
                <dd className="text-[#1A1F36] text-right">{account?.balance_with_transactions} €</dd>

                <dt className="text-[#697386]">IBAN</dt>
                <dd className="text-[#1A1F36] text-right font-mono text-xs tracking-wide">{account?.iban}</dd>

                <dt className="text-[#697386]">Name</dt>
                <dd className="text-[#1A1F36] text-right">{account?.name}</dd>

                <dt className="text-[#697386]">Type</dt>
                <dd className="text-[#1A1F36] text-right capitalize">{account?.account_type?.toLowerCase()}</dd>

                <dt className="text-[#697386]">Savings goal</dt>
                <dd className="text-[#1A1F36] text-right">{account?.savings_goal} €</dd>
            </dl>
        </div>
    );
}

export default Panel;
