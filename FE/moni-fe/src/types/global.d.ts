import TransactionForm from "../ui/account-detail/transactions/TransactionForm";

type Account = {
    id: number;
    balance: number;
    iban: string;
    name: string;
    savings_goal: number;
    account_type: string;
    balance_with_transactions: number;
    status?: string;
};

type AccountsResponse = {
    accounts: Array<Account>;
    totalBalance: number;
};

type AccountFormData = {
    iban: string;
    name: string;
    balance: number;
    savings_goal: number;
    account_type: string;
    id: string;
};

type AccountDataResponse = {
    account: Account;
    status: string;
    message: string;
}

type Transaction = {
    id: number;
    sum: number;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_date: string;
    accountId?: number;
};

type TransactionFormData = {
    accountId: string;
    sum: number;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_date: string;
    data?: Transaction;
    months?: number;
};

type MonthlyTransactionFormData = {
    transactionData: TransactionFormData;
    months: number;
}

type DeleteSelectedTransactionsFormData = {
    transactions: Number[];
    accountId: number;
}

type UpdateSelectedTransactionFormData = {
    transactionIds: Number[];

    accountId: number;
    sum: number;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_date: string;
}

type TimeSpan = {
    from: string;
    to: string;
}

type TimeSpanResponse = {
    id: number;
    from: string;
    to: string;
}