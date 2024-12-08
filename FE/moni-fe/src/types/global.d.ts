
export type Account = {
    id: number;
    balance: number;
    iban: string;
    name: string;
    savings_goal: number;
    account_type: string;
    balance_with_transactions: number;
    status?: string;
};

export type AccountsResponse = {
    accounts: Array<Account>;
    totalBalance: number;
};

export type AccountFormData = {
    iban: string;
    name: string;
    balance: number;
    savings_goal: number;
    account_type: string;
    id: string;
};

export type AccountDataResponse = {
    account: Account;
    status: string;
    message: string;
}

export type Transaction = {
    id: number;
    sum: number;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_date: string;
    accountId?: number;
};

export type TransactionFormData = {
    accountId: string;
    sum: number;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_date: string;
    data?: Transaction;
    months?: number;
};

export type MonthlyTransactionFormData = {
    transactionData: TransactionFormData;
    months: number;
}

export type DeleteSelectedTransactionsFormData = {
    transactions: Number[];
    accountId: number;
}

export type UpdateSelectedTransactionFormData = {
    transactionIds: Number[];

    accountId: number;
    sum: number;
    description: string;
    transaction_type: string;
    transaction_category: string;
    transaction_date: string;
}

export type TimeSpan = {
    from: string;
    to: string;
}

export type TimeSpanResponse = {
    id: number;
    from: string;
    to: string;
    status?: string;
}

export interface SumsPerMonth {
    SEPTEMBER: number;
    OCTOBER: number;
    NOVEMBER: number;
    DECEMBER: number;
    JANUARY: number;
    FEBRUARY: number;
    MARCH: number;
    APRIL: number;
    MAY: number;
    JUNE: number;
    JULY: number;
    AUGUST: number;
    [key: string]: number;
}

export interface Statistics {
    account: Account;
    sumsPerMonth: SumsPerMonth;
}

export interface AccountsStatisticData {
    data: Statistics[];
}

export type User = {
    email: string;
    password: string;
}

export type RegistrationData = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
}