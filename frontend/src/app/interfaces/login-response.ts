export interface LoginResponse {
    _id: string;
    email: string;
    user: string;
    name: string;
    surname: string;
    role?: string;
    qualification?: string;
    discipline?: string;
    address?: string;
}