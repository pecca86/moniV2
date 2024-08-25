import AddModal from "../../cta/AddModal";
import AccountForm from "../../accounts/AccountForm";
import EditIcon from '@mui/icons-material/Edit';
import { Divider } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getAccountById } from "../../../services/apiAccounts";

const Panel = () => {

    const data: Account = {
        iban: 'FI 2030230203',
        name: 'FI Deposit',
        balance: 100,
        savings_goal: 9999.90,
        account_type: 'OTHER',
        id: 1
    }

    // const { isPending, data: accounts, error } = useQuery({
    //     queryKey: ['account'],
    //     queryFn: getAccountById('1'),
    // })

    return (
        <div className='bg-white flex flex-col px-2 rounded-lg shadow-lg p-2'>
            <div className="my-2">
                <AddModal
                    ctaText=""
                    heading='Update Account Info'
                    paragraph='Edit the fields below'
                    form={<AccountForm update={true} accountData={data}/>}
                    buttonIcon={<EditIcon />}
                />
            </div>
            <div className="grid grid-cols-2">
                <div className="col-1">
                    <p className="text-lg mb-1 font-bold">Balance</p>
                    <Divider />
                    <p className="pt-1">IBAN</p>
                    <Divider />
                    <p className="pt-1">Name</p>
                    <Divider />
                    <p className="pt-1">Savings goal</p>
                </div>
                <div className="col-2">
                    <p className="text-lg mb-1 font-bold">100 €</p>
                    <Divider />
                    <p className="pt-1">FI 2030230203</p>
                    <Divider />
                    <p className="pt-1">FI Deposit</p>
                    <Divider />
                    <p className="pt-1">9999.90 €</p>
                </div>
            </div>
        </div>
    );
}

export default Panel;
