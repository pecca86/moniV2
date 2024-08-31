import toast from "react-hot-toast";
import { TimeSpanResponse } from "../types/global";
const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJwQHBleC5jb20iLCJpYXQiOjE3MjUwOTIyOTQsImV4cCI6MTcyNTY5NzA5NH0.g1Sbqke24LwyJDZot5xFW_sPCop8kZ6-DYXkRAyWl18";


export async function getDateSpansForAccount(accountId: string | number | undefined) {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/datespans/${accountId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data: TimeSpanResponse[] = await response.json();

        return data;
    } catch (error) {
        toast.error('Error fetching accounts');
    }
}
