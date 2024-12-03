'use client'

import { useAppSelector } from "@/redux/hooks";
import axs from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";

const useChangePassword = () => {

    const [loading, setLoading] = useState(false);
    const token = useAppSelector(state => state.auth.token);

    const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
        if (currentPassword && newPassword && confirmPassword) {
            setLoading(true);
            try {
                const response = await axs.put('/user/update-password', {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                );

                if (response.status === 200) {
                    toast.success('Password changed successfully');
                }
            } catch (error) {
                console.log(error);
            }
            finally {
                setLoading(false);
            }
            
        }
    }

    return { changePassword, loading };
}

export default useChangePassword;