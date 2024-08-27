import toast from "react-hot-toast";
import { Transaction, TransactionFormData } from "../types/global";

const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjQ1OTk4MDAsImV4cCI6MTcyNTIwNDYwMH0.xWDEjtLAcrR9PLunRa1b5xvexj3jVvxTXxWjhQJT3hs";

export async function getTransactions() {
    try {
        const response: Response = await fetch('http://localhost:8080/api/v1/transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: Array<Transaction> = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching transactions');
    }
}

export async function addTransaction(transactionData: TransactionFormData) {
    try {
        transactionData.transaction_type = transactionData.transaction_type.toUpperCase();
        transactionData.transaction_category = transactionData.transaction_category.toUpperCase();
        const response: Response = await fetch(`http://localhost:8080/api/v1/transactions/${transactionData.accountId}`, {
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

export async function addMonthlyTransaction(data: MonthlyTransactionFormData) {
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
        await fetch(`http://localhost:8080/api/v1/transactions/${transactionData.accountId}/create-monthly`, {
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

export async function deleteSelectedTransactions(data: DeleteSelectedTransactionsFormData) {
    try {
        await fetch(`http://localhost:8080/api/v1/transactions/${data.accountId}/delete-all`, {
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

export async function updateTransaction(transactionData: Transaction, transactionId: number) {
    try {
        transactionData.transaction_type = transactionData.transaction_type.toUpperCase();
        transactionData.transaction_category = transactionData.transaction_category.toUpperCase();
        const response: Response = await fetch(`http://localhost:8080/api/v1/transactions/${transactionId}`, {
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
        toast.error('Error adding transaction');
    }
}

export async function updateSelectedTransactions(data: UpdateSelectedTransactionFormData, accountId: number) {
    try {
        data.transaction_type = data.transaction_type.toUpperCase();
        data.transaction_category = data.transaction_category.toUpperCase();

        const response: Response = await fetch(`localhost:8080/api/v1/transactions/${accountId}/update-all`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const responseData: Transaction = await response.json();
        return responseData;
    } catch (error) {
        // log error
    }

}
