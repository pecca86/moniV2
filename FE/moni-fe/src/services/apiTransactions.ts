import toast from "react-hot-toast";

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