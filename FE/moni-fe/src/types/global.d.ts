type Account = {
    id: number;
    balance: number;
    iban: string;
    name: string;
    savings_goal: number;
    account_type: string;
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
