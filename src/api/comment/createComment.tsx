'use client'

import { addComment, addReplyComment, increaCountComment} from "@/redux/features/comment/commentSlice"
import { setCountComment } from "@/redux/features/post/postSlice"
import { selectUser } from "@/redux/features/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import axs from "@/utils/axios"
import { useEffect, useState } from "react"

const useCreateComment = (postId?: number) => {
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const token = useAppSelector((state)=> state.auth.token)

    const socket = useSocket('comments')

    // const existComment = new Set()

    useEffect(()=> {
        if(socket){
            if(postId){
                socket.emit('joinPost', {postId: postId})
            }
            socket.on('messageCreated', (comment)=> {
                dispatch(addComment({
                    ...comment,
                    created_by: {
                        id: comment.created_by.id,
                        fullName: comment.created_by.fullName,
                        avatar: comment.created_by.avatar,
                        username: comment.created_by.username
                    },
                    created_at: new Date().toISOString()
                }))
                dispatch(setCountComment({postId: comment.post.id}))
                
            })

            return ()=> {
                socket.off('commentCreated')
            }
        }


    }, [socket, dispatch])

    const createComment = async (postId: number, content: string, parentId?: string, commentId?: string) => {
        setLoading(true)
        try {
            if(socket && !parentId && !commentId){
                socket.emit('createComment', {
                    postId: postId,
                    content: content,
                    parentId: parentId,
                    commentId: commentId,
                    userId: user.id
                })
            }
            else {
                const {data} = await axs.post(`/comment/create-comment`, {
                    content: content,
                    parentId: parentId,
                    postId: postId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if(data){
                    dispatch(addReplyComment({
                        parentId: parentId || '',
                        commentId: data.commentId,
                        replyComment: data
                    }))
                    dispatch(increaCountComment({parentId: parentId || ''}))
                    dispatch(setCountComment({postId: postId}))
                }
            }

        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
    }
    return {createComment, loading}
}

export default useCreateComment