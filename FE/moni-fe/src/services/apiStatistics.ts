const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjUwOTIyOTQsImV4cCI6MTcyNTY5NzA5NH0.g1Sbqke24LwyJDZot5xFW_sPCop8kZ6-DYXkRAyWl18";


export async function getAllAccountsAndTransactionsStatistics() {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return  await response.json();
    } catch (error) {
        // toast.error('Error fetching accounts statistics');
        // log error
    }
}

export async function getAccountTransactionStatistics(accountId: string) {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/statistics/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: any = await response.json();

        return { data: [data]};
        // return data;
    } catch (error) {
        // toast.error('Error fetching account statistics');
        // log error
    }
}