import Panel from "./Panel";
import TransactionList from "./TransactionList";
import { Divider } from "@mui/material";
import { TransactionSelectionProvider } from "./TransactionSelectionContext";

const DetailMain = () => {
    return (
        <div className="flex flex-col gap-5">
            <Panel />
            <Divider />
            <TransactionSelectionProvider>
                <TransactionList />
            </TransactionSelectionProvider>
        </div>
    );
}

export default DetailMain;
