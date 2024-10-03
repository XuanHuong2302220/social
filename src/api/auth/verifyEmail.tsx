'use client'

import { setToken } from "@/redux/features/auth/authSlice";
import { selectUser } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axs from "@/utils/axios";
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify";

const verifyEmail = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const {id} = useParams();
    const user = useAppSelector(selectUser);

    const verify = async () => {
        setLoading(true);
        try {
            setLoading(true);
            const response = await axs.get(`/auth/confirm-email/${id}`);
            const data = await response.data
            if (data.token) {
                localStorage.setItem('token', JSON.stringify(data.token));
                dispatch(setToken(data.token));
                router.push(`/information/${user.username}`);
            }
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