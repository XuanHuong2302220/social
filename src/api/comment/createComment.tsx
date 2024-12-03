'use client'

import { addComment, addReplyComment, increaCountComment} from "@/redux/features/comment/commentSlice"
import { setCountComment } from "@/redux/features/post/postSlice"
import { selectUser } from "@/redux/features/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import axs from "@/utils/axios"
import { useEffect, useState } from "react"

const useCreateComment = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const socket = useSocket('comments')

    const existComment = new Set()

    useEffect(()=> {
        if(socket){
            socket.on('commentCreated', (comment)=> {
                if(!existComment.has(comment.commentId)){
                    existComment.add(comment.commentId)
                    if(comment.parentId){
                    dispatch(addReplyComment({
                        parentId: comment.parentId,
                        commentId: comment.commentId,
                        replyComment: comment
                    }))
                    dispatch(increaCountComment({parentId: comment.parentId}))
                    dispatch(setCountComment({postId : comment.post.id}))
                    }
                    else {
                        dispatch(addComment({
                            ...comment,
                            created_by: {
                                id: comment.created_by.id,
                                fullName: comment.created_by.fullName,
                                avatar: comment.created_by.avatar
                            },
                            created_at: new Date().toISOString()
                        }))
                        dispatch(setCountComment({postId: comment.post.id}))
                    }
                }
            })
            

            return ()=> {
                socket.off('commentCreated')
            }
        }


    }, [socket, dispatch])

    const createComment = async (postId: number, content: string, parentId?: string, commentId?: string) => {
        setLoading(true)
        try {
            if(socket){
                socket.emit('createComment', {
                    postId: postId,
                    content: content,
                    parentId: parentId,
                    commentId: commentId,
                    userId: user.id
                })
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