'use client'

import { setUser } from "@/redux/features/user/userSlice";
import { useAppDispatch } from "@/redux/hooks";
import axs from "@/utils/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "react-toastify";

const useSignupApi = () => {

    const dispatch = useAppDispatch();

    const route = useRouter();

    const [loading, setLoading] = useState(false);

    const signup = async (username: string, password: string, confirmPassword: string, email: string) => {
        try {
            setLoading(true);
            const response = await axs.post('/auth/register', { username: username, password: password, email: email, confirmPassword: confirmPassword });   
            const data = await response.data
            dispatch(setUser({
                id: data.user.id,
                username: data.user.username,
                email: data.user.email,
                firstName: data.user.firstName || "",
                lastName: data.user.lastName || "",
                gender: data.user.gender || null,
                avatar: data.user.avatar || null,
                dob: data.user.dob || null,
              }));
            toast.success(data.message, {
                position: 'bottom-center',
            })
            setTimeout(()=> {
                route.push('/login')
            }, 3000)
        }
        catch (error: any) {
            if (error instanceof AxiosError && error.response) {
                toast.warning(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    }
    return {signup, loading};
}

export default useSignupApi;