'use client'

import { setToken } from "@/redux/features/auth/authSlice";
import { selectUser } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import axs from "@/utils/axios";
import { AxiosError } from "axios";
import { useParams} from "next/navigation"
import { useState } from "react"
import { toast } from "react-toastify";

const useVerifyEmail = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false)
    const {id} = useParams();
    const user = useAppSelector(selectUser);

    const verify = async () => {
        setLoading(true);
        try {
            setLoading(true);
            const response = await axs.get(`/auth/confirm-email/${id}`);
            const data = await response.data
            console.log(data)
            if (data.token) {
                localStorage.setItem('token', JSON.stringify(data.token));
                dispatch(setToken(data.token));
                // router.push(`/information/${user.username}`);
                window.location.href = `/information/${user.username}`;
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
        finally {
            // setLoading(false);
        }
    }

    return {verify, loading}
}

export default useVerifyEmail;