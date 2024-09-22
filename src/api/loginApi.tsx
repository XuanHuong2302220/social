'use client'

import { setUser } from "@/redux/features/user/userSlice";
import axs from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";

const useLoginApi = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Khởi tạo state cho error

    const handleErrors = (password: string) => {
        if (password.length < 6) {
            return 'Password must be at least 6 characters';
        }
        return null; // Trả về null nếu không có lỗi
    };

    const login = async (username: string, password: string) => {
        const errorMessage = handleErrors(password);
        if (errorMessage) {
            setError(errorMessage); // Gán lỗi nếu có
            return;
        }

        try {
            setLoading(true);
            const response = await axs.post('/auth/login', { username: username, password: password });
            console.log(response);
            // const token = response.data.token; // Assuming your backend returns a JWT token
            // axs.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token in default Axios headers
            // localStorage.setItem('token', token); // Save it for future use
            // console.log(response.data);

        } catch (error: any) {
            toast.warning(error?.response?.data?.message || "Login failed", {
                position: 'bottom-center',
            });
            
        } finally {
            setLoading(false);
        }
    };

    return { error, login, loading }; // Trả về error, login và loading
};

export default useLoginApi;
