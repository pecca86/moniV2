import AddModal from "../../cta/AddModal";
import AccountForm from "../../accounts/AccountForm";
import EditIcon from '@mui/icons-material/Edit';
import { Divider } from "@mui/material";
import { useFetchAccount } from "../../../hooks/account/useFetchAccount";
import { useParams } from "react-router-dom";
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import MoniBanner from "../../banners/MoniBanner";
import { Delete } from "@mui/icons-material";
import AccountDeleteForm from "../../accounts/AccountDeleteForm";
import { useUser } from "../../../hooks/auth/useUser";

const Panel = () => {

    // accountId is specified in App.tsx as a route parameter
    const { accountId } = useParams<{ accountId: string }>();
    const { token } = useUser();

    const { isPending, account, error } = useFetchAccount(accountId as string, token);

    if (isPending) {
        return (
            <Stack spacing={1}>
                <Skeleton variant="rectangular" width={350} height={137} />
            </Stack>
        )
    }

    if (!isPending && error) {
        return <MoniBanner style="warning">There was a problem fetching the account data, please try again later!</MoniBanner>
    }

    if (account?.status === "NOT_FOUND") {
        return (
            <div className="my-2">
                <MoniBanner style="warning">Account not found!</MoniBanner>
            </div>
        )
    }

    return (
        <div className='bg-white flex flex-col px-2 rounded-lg shadow-lg p-2'>
            <div className="my-2">
                <div className="flex gap-2">
                    <AddModal
                        ctaText=""
                        heading='Update Account Info'
                        paragraph='Edit the fields below'
                        form={<AccountForm update={true} accountData={account} handleClose={undefined} />}
                        buttonIcon={<EditIcon />}
                    />
                    <AddModal
                        ctaText=""
                        heading='Delete account'
                        paragraph='Are you sure you want to delete this account and all related transactions?'
                        form={<AccountDeleteForm />}
                        buttonIcon={<Delete />}
                    />
                </div>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2">
                <div className="col-1">
                    <p className="text-lg mb-1 font-bold">Balance</p>
                    <Divider />
                    <p className="pt-1 font-semibold">With transactions</p>
                    <Divider />
                    <p className="pt-1 font-semibold">IBAN</p>
                    <Divider />
                    <p className="pt-1 font-semibold">Name</p>
                    <Divider />
                    <p className="pt-1 font-semibold">Type</p>
                    <Divider />
                    <p className="pt-1 font-semibold">Savings goal</p>
                </div>
                <div className="col-2">
                    <p className="text-lg mb-1 font-bold">{account?.balance} €</p>
                    <Divider />
                    <p className="pt-1">{account?.balance_with_transactions} €</p>
                    <Divider />
                    <p className="pt-1">{account?.iban}</p>
                    <Divider />
                    <p className="pt-1">{account?.name}</p>
                    <Divider />
                    <p className="pt-1">{account?.account_type?.toLowerCase()}</p>
                    <Divider />
                    <p className="pt-1">{account?.savings_goal} €</p>
                </div>
            </div>
        </div>
    );
}

export default Panel;
