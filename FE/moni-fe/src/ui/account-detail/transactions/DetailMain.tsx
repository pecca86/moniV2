import Panel from "./Panel";
import TransactionList from "./TransactionList";
import { TransactionSelectionProvider } from "./TransactionSelectionContext";

const DetailMain = () => {
    return (
        <div className="flex flex-col gap-6">
            <Panel />
            <TransactionSelectionProvider>
                <TransactionList timeSpanTransactions={undefined} />
            </TransactionSelectionProvider>
        </div>
    );
}

export default DetailMain;
