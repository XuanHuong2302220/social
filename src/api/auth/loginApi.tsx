'use client'

import { selectUser, setUser } from "@/redux/features/user/userSlice";
import axs from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {auth} from "@/firebase/firebase";

const useLoginApi = () => {
    const router = useRouter()
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            let idToken = await user.getIdToken();
        
            const displayName = user.displayName || '';
            const [firstName, lastName] = displayName.split(' ');

            const response = await axs.post('/auth/store-GG-Info', {
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                avatar: user.photoURL,
                refreshToken: user.refreshToken,
                id: user.uid,
            })

            const data = await response.data;

            await axs.post('/auth/store-refresh-token', {
                refreshToken: user.refreshToken
            })

            dispatch(setUser({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                avatar: data.photoURL,
                id: data.id,
                username: data.username,
                dob: data.dob,
                gender: data.gender
            }))

            idToken = await user.getIdToken(true);
            localStorage.setItem('token', JSON.stringify(idToken));
            if(data.username){
                router.push('/');
            }
            else {
                router.push(`/information/${data.id}`);
            }
        } catch (error: any) {
            toast.warning(error?.response?.data?.message || "Login failed", {
                position: 'bottom-center',
            });
            
        }
    };

    const login = async (username: string, password: string) => {
        
        try {
            setLoading(true);
            const response = await axs.post('/auth/login', { username: username, password: password });
            const token = await response.data.token
            localStorage.setItem('token', JSON.stringify(token));
            const user = await response.data.user
            dispatch(setUser({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                gender: user.gender,
                email: user.email,
                avatar: user.avatar,
                id: user.id,
                dob: user.dob,
            }))

            router.push('/');

        } catch (error: any) {
            toast.warning(error?.response?.data?.message || "Login failed", {
                position: 'bottom-center',
            });
            
        } finally {
            setLoading(false);
        }
    };

    return {login, loading, loginWithGoogle};
};

export default useLoginApi;
