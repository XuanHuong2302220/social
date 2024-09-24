'use client'

import { selectUser } from "@/redux/features/user/userSlice";
import axs from "@/utils/axios";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const verifyEmail = () => {

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const {id} = useParams();
    const user = useSelector(selectUser);

    const verify = async () => {
        setLoading(true);
        try {
            setLoading(true);
            const response = await axs.get(`/auth/confirm-email/${id}`);
            const token = await response.data.token;
            localStorage.setItem('token', token);

            router.push(`/information/${user.username}`);
        } catch (error : any) {
            toast.error(error?.response?.data?.message, {
                position: 'bottom-center',
            });
        }
        finally {
            setLoading(false);
        }
    }

    return {verify, loading}
}

export default verifyEmail;