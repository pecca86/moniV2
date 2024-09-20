import { User } from "../types/global";
import toast from "react-hot-toast";

export async function login(user: User) {
    try {
        const response: Response = await fetch(`http://localhost:8080/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        
        return await response.json();
    } catch (error) {
        throw new Error('Failed to login!');
    }
}