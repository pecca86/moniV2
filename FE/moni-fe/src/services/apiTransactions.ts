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