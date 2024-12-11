'use client'

import { selectUser, setAttributes } from "@/redux/features/user/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UserState } from "@/types";
import axs from "@/utils/axios";
import { AxiosError } from "axios";
import { useState } from "react"
import { toast } from "react-toastify";

interface FormValues {
    firstName: string;
    lastName: string;
    dob: string;
    gender: 'female' | 'male'
  }

const useUpdateUser = () => {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const token = useAppSelector(state => state.auth.token);
    const userState = useAppSelector(selectUser)

   const update = async(user: FormValues) => {
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
            const {data, message} = await response.data;

            if(data){
                dispatch(setAttributes({
                    ...userState,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    dob: data.dob,
                    gender: data.gender
                }))
            }

            toast.success(message)
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
   }

   return {update, loading}
}

export default useUpdateUser;