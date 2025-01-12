import toast from "react-hot-toast";
import { Account, AccountDataResponse, AccountFormData, AccountsResponse } from "../types/global";

export async function getAccounts(token: string | null) {
    try {
        const response: Response = await fetch('http://localhost:8080/api/v1/accounts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: AccountsResponse = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching accounts');
    }
}

export async function getAccountById(id: string, token: string | null) {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/accounts/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: Account = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching account');
    }
}

export async function addAccount(accountData: AccountFormData, token: string | null) {
    console.log("Account: ", accountData);
    try {
        accountData.account_type = accountData.account_type.toUpperCase();
        const response: Response = await fetch('http://localhost:8080/api/v1/accounts', {
            method: 'POST',
            body: JSON.stringify(accountData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: AccountDataResponse = await response.json();
        return data;

    } catch (error) {
        toast.error('Error adding account');
    }
}

export async function updateAccount(accountData: AccountFormData, token: string | null) {
    try {
        accountData.account_type = accountData.account_type.toUpperCase();
        const response: Response = await fetch(`http://localhost:8080/api/v1/accounts/${accountData.id}`, {
            method: 'PUT',
            body: JSON.stringify(accountData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: AccountDataResponse = await response.json();
    
        return data;

    } catch (error) {
        toast.error('Error updating account');
    }
}

export async function deleteAccount(id: string | undefined, token: string | null) { 
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/accounts/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: AccountDataResponse = await response.json();
        return data;

    } catch (error) {
        toast.error('Error deleting account');
    }
}