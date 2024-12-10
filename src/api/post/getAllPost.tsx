'use client'

import { addPosts, setCurrentPage, setHasMore, setLoading} from "@/redux/features/post/postSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import axs from "@/utils/axios"
import { AxiosError } from "axios"
import { useCallback} from "react"
import { toast } from "react-toastify"

const useGetAllPost = () => {
    const token = useAppSelector((state) => state.auth.token)
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector((state) => state.post.currentPage)
    const hasMore = useAppSelector((state) => state.post.hasMore)

    const getAllPost = useCallback(async (userId?: string) => {

        dispatch(setLoading(true))
        try {
            const response = await axs.get(`/post/get-all-post?page=${currentPage}&pageSize=10${userId ? '&userid=' + userId : '' }`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const {data, meta} = await response.data

            dispatch(addPosts(data));
            if (meta.hasNextPage) {
                dispatch(setHasMore(meta.hasNextPage))
                dispatch(setCurrentPage(currentPage + 1));
            }
            else {
                dispatch(setHasMore(false))
            }

        } catch (error) {
            if (error instanceof AxiosError && error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
          }
        finally {
            dispatch(setLoading(false))
        }
    }, [currentPage, hasMore, token, dispatch])

    return {getAllPost}
}

export default useGetAllPost