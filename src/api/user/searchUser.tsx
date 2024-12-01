'use client'

import { useAppSelector } from "@/redux/hooks";
import { PostState, UserProps } from "@/types";
import axs from "@/utils/axios";
import { useState } from "react";

const useSearch = ()=> {

    const [loadingSearch, setLoadingSearch] = useState(false);
    const token = useAppSelector(state => state.auth.token);
    const [result, setResult] = useState<UserProps[]>([])
    const [postResult, setPostResult] = useState<PostState[]>([])

    const searchUser = async (search: string) => {
        setLoadingSearch(true)
        try {
            const response = await axs.get(`/post/search?searchTerm=${search}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {posts, users} = response.data;
            console.log(users, posts)
            setResult(users)
            setPostResult(posts)
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoadingSearch(false)
        }
    }

    return {searchUser, result, loadingSearch, postResult}
}

export default useSearch;