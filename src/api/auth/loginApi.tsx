'use client'

import { setUser } from "@/redux/features/user/userSlice";
import axs from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth} from "@/firebase/firebase";
import { setToken } from "@/redux/features/auth/authSlice";
import { AxiosError } from "axios";

const useLoginApi = () => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const userGg = result.user;
        
            const displayName = userGg.displayName || '';
            const [firstName, lastName] = displayName.split(' ');

            const response = await axs.post('/auth/login-gg', {
                firstName: firstName,
                lastName: lastName,
                email: userGg.email,
                avatar: userGg.photoURL,
            })

            const {token, user} = await response.data;
            dispatch(setToken(token.token));
            dispatch(setUser({
                ...user,
                followers: user.followers || 0,
                followings: user.followings || 0,
                postCount: user.postCount || 0,
            }))

            if(user.dob && user.gender){
                window.location.href = '/';
            }
            else {
                window.location.href = `/information/${user.username}`
            }
        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.warning(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        }
    };

    const login = async (username: string, password: string) => {
        
        try {
            setLoading(true);
            const response = await axs.post('/auth/login', { username: username, password: password });
            const token = await response.data.token.token
            const user = await response.data.user
            dispatch(setToken(token))
            dispatch(setUser({
                ...user,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                email: user.email,
                avatar: user.avatar,
                id: user.id,
                dob: user.dob,
            }))

            if(user.fullName && user.lastName){
                router.push('/');
            }

            else {
                router.push(`/information/${user.username}`);
            }

        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.warning(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return {login, loading, loginWithGoogle};
};

export default useLoginApi;
