'use client'

import { useAppSelector } from "@/redux/hooks";
import { UserProps } from "@/types";
import axs from "@/utils/axios";
import { useState } from "react";

const useSearch = ()=> {

    const [loadingSearch, setLoadingSearch] = useState(false);
    const token = useAppSelector(state => state.auth.token);
    const [result, setResult] = useState<UserProps[]>([])

    const searchUser = async (search: string) => {
        setLoadingSearch(true)
        try {
            const response = await axs.get(`/post/search?searchTerm=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {posts, users} = response.data;
            if(users.length > 0){
                setResult(users)
            }
            

        } catch (error) {
            console.log(error)
        }
        finally {
            setLoadingSearch(false)
        }
    }

    return {searchUser, result, loadingSearch}
}

export default useSearch;