export function useUser() {
    const token = localStorage.getItem('token');
    return { token };
}