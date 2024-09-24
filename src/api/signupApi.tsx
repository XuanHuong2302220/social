'use client'

import { setUser } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import axs from "@/utils/axios";
import { useState } from "react"
import { toast } from "react-toastify";

const signupApi = () => {

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null); // Khởi tạo state cho error

    let failed;

    const handleErrors = (password: string, confirmPassword: string) => {
        if (password.length < 6 || confirmPassword.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return null; // Trả về null nếu không có lỗi
    };

    const signup = async (username: string, password: string, confirmPassword: string, email: string) => {
        const errorMessage = handleErrors(password, confirmPassword);
        if (errorMessage) {
            setError(errorMessage); // Gán lỗi nếu có
            return;
        }

        try {
            setLoading(true);
            const response = await axs.post('/auth/register', { username: username, password: password, email: email, confirmPassword: confirmPassword });   
            const data = await response.data
            console.log(data)
            dispatch(setUser(data));
            toast.success(data.message, {
                position: 'bottom-center',
            })
        }
        catch (error: any) {
            toast.warning(error?.response?.data?.message || "Login failed", {
                position: 'bottom-center',
            });

            failed = true;
            
        } finally {
            setLoading(false);
        }
    }
    return {error, signup, loading, failed};
}

export default signupApi;