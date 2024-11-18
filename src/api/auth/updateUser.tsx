'use client'

import { setUser } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UserState } from "@/types";
import axs from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "react-toastify";

const updateUser = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const token = useAppSelector(state => state.auth.token);

   const update = async(user: UserState) => {
    setLoading(true)
        try {
            const response = await axs.put('/user/update-inform', {
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dob,
                gender: user.gender
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            }
        )
            const data = await response.data;

            if(data){
                dispatch(setUser({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dob: user.dob,
                    gender: user.gender
                }))
            }

            toast.success(data.message)
            router.push('/')
        } catch (error:any) {
            toast.error(error.response.data.message)
        }
   }

   return {update, loading}
}

export default updateUser;