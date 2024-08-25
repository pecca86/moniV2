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