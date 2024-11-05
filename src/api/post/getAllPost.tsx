'use client'

import { addPosts, setCurrentPage, setHasMore, setLoading, setPosts } from "@/redux/features/post/postSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { useCallback, useContext, useState } from "react"

const useGetAllPost = () => {
    const token = useAppSelector((state) => state.auth.token)
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector((state) => state.post.currentPage)
    const hasMore = useAppSelector((state) => state.post.hasMore)

    const getAllPost = useCallback(async () => {

        if(!hasMore) {
            console.log('Không còn dữ liệu để tải thêm');
            return
        }

        dispatch(setLoading(true))
        try {
            const response = await axs.get(`/post/get-all-post`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data, meta} = await response.data
            console.log(response.data)
            const flattenedData = data.flat();

            dispatch(addPosts(flattenedData));
            if (meta.hasNextPage) {
                dispatch(setHasMore(meta.hasNextPage))
                dispatch(setCurrentPage(currentPage + 1));
            }
            else {
                dispatch(setHasMore(false))
            }

        } catch (error : any) {
            console.log(error.response?.data)
        }
        finally {
            dispatch(setLoading(false))
        }
    }, [currentPage, hasMore, token, dispatch])

    return {getAllPost}
}

export default useGetAllPost