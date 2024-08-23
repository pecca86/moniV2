import toast from "react-hot-toast";


export async function getAccounts() {
    try {
        const response: Response = await fetch('http://localhost:8080/api/v1/accounts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjQzNjMyNTksImV4cCI6MTcyNDk2ODA1OX0.W_LR4Z9Fsa-gvshadGAPPVr9_2GXgoyhr5V8n0WEi5A`
            }
        });

        const data: Array<Account> = await response.json();

        console.log("Data: ", data);

        return data;
    } catch (error) {
        toast.error('Error fetching accounts');
    }
}