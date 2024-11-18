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

        } catch (error: any) {
            // Ghi lại thông tin chi tiết về lỗi
            console.error("Error fetching posts:", error);
            if (error.response) {
              // Lỗi từ phía máy chủ
              console.error("Server responded with status:", error.response.status);
              console.error("Response data:", error.response.data);
            } else if (error.request) {
              // Lỗi từ phía yêu cầu
              console.error("No response received:", error.request);
            } else {
              // Lỗi khác
              console.error("Error setting up request:", error.message);
            }
            throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
          }
        finally {
            dispatch(setLoading(false))
        }
    }, [currentPage, hasMore, token, dispatch])

    return {getAllPost}
}

export default useGetAllPost