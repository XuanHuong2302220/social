'use client'

import axs from "@/utils/axios";
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

        } catch (error: any) {
            toast.error(error.response.data.message);
        }
        finally {
            setLoading(false);
        }
    }

    return {fgPass, loading}
}

export default useForgotPassword;