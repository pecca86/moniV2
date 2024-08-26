import Panel from "./Panel";
import TransactionList from "./TransactionList";
import { Divider } from "@mui/material";

const DetailMain = () => {
    return (
        <div className="flex flex-col gap-5">
            <Panel />
            <Divider />
            <TransactionList />
        </div>
    );
}

export default DetailMain;
