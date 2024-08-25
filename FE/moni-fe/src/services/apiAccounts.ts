import toast from "react-hot-toast";


export async function getAccounts() {
    try {
        const response: Response = await fetch('http://localhost:8080/api/v1/accounts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjQ1ODA3MjYsImV4cCI6MTcyNTE4NTUyNn0.vxmg8pZCekePIQ7P1MvrgtNDp8ElnoThKyIXb3GS6oA`
            }
        });

        const data: Array<Account> = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching accounts');
    }
}

export async function addAccount(accountData: AccountFormData) {
    try {
        accountData.account_type = accountData.account_type.toUpperCase();
        const response: Response = await fetch('http://localhost:8080/api/v1/accounts', {
            method: 'POST',
            body: JSON.stringify(accountData),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjQ1ODA3MjYsImV4cCI6MTcyNTE4NTUyNn0.vxmg8pZCekePIQ7P1MvrgtNDp8ElnoThKyIXb3GS6oA`
            }
        });

        const data: AccountDataResponse = await response.json();
        console.log("Account: ", data.account);
        console.log("Status: ", data.status);
        console.log("Message: ", data.message);

        return data;

    } catch (error) {
        toast.error('Error adding account');
    }
}