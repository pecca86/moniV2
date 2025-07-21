import toast from "react-hot-toast";
import { DeleteSelectedTransactionsFormData, MonthlyTransactionFormData, Transaction, TransactionFormData, UpdateSelectedTransactionFormData } from "../types/global";

export async function getAccountTransactions(accountId: string | undefined, token: string | null){
    try {
        const response: Response = await fetch(`/api/v1/transactions/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: any = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching transactions');
    }
}

export async function addTransaction(transactionData: TransactionFormData, token: string | null) {
    try {
        transactionData.transaction_type = transactionData.transaction_type.toUpperCase();
        transactionData.transaction_category = transactionData.transaction_category.toUpperCase();
        const response: Response = await fetch(`/api/v1/transactions/${transactionData.accountId}`, {
            method: 'POST',
            body: JSON.stringify(transactionData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: Transaction = await response.json();
        return data;

    } catch (error) {
        toast.error('Error adding transaction');
    }
}

export async function addMonthlyTransaction(data: MonthlyTransactionFormData, token: string | null) {
    const { transactionData, months } = data;
    transactionData.transaction_type = transactionData.transaction_type.toUpperCase();
    transactionData.transaction_category = transactionData.transaction_category.toUpperCase();

    const requestBody = {
        data: {
            ...transactionData
        },
        months: months
    }

    try {
        await fetch(`/api/v1/transactions/${transactionData.accountId}/create-monthly`, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // const data: Transaction = await response.json();
        return "Success";

    } catch (error) {
        // log error
    }
}

export async function deleteSelectedTransactions(data: DeleteSelectedTransactionsFormData, token: string | null) {
    try {
        await fetch(`/api/v1/transactions/${data.accountId}/delete-all`, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return "Success";

    } catch (error) {
        // log error
    }
}

export async function deleteAllOldTransactions(accountId: string | undefined, token: string | null): Promise<void> {

    try {
        await fetch(`/api/v1/transactions/${accountId}/delete-old`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    } catch (error) {
        // log error
    }
}

export async function updateTransaction(transactionData: Transaction, token: string | null) {
    try {
        transactionData.transaction_type = transactionData.transaction_type.toUpperCase();
        transactionData.transaction_category = transactionData.transaction_category.toUpperCase();
        const response: Response = await fetch(`/api/v1/transactions/${transactionData.id}`, {
            method: 'PUT',
            body: JSON.stringify(transactionData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: Transaction = await response.json();
        return data;

    } catch (error) {
        // log error
    }
}

export async function updateSelectedTransactions(data: UpdateSelectedTransactionFormData, token: string | null) {
    try {
        data.transaction_type = data.transaction_type.toUpperCase();
        data.transaction_category = data.transaction_category.toUpperCase();
        const payload = {
            transactionIds: data.transactionIds,
            data: {
                sum: Number(data.sum),
                description: data.description,
                transaction_type: data.transaction_type,
                transaction_category: data.transaction_category,
                transaction_date: data.transaction_date
            }
        }
        const response: Response = await fetch(`/api/v1/transactions/${data.accountId}/update-all`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return await response.json();
    } catch (error) {
        // log error
    }

}
