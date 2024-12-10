'use client'

import axs from "@/utils/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const useForgotPassword = () =>{
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fgPass = async (email: string) => {
        setLoading(true);
        try {
            const response = await axs.post('/auth/reset-password', {email});
            toast.success(response.data.message);
            router.push('/login');

        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
        finally {
            setLoading(false);
        }
    }

    return {fgPass, loading}
}

export default useForgotPassword;