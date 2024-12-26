'use client'

import { addComment, addReplyComment, increaCountComment} from "@/redux/features/comment/commentSlice"
import { setCountComment } from "@/redux/features/post/postSlice"
import { selectUser } from "@/redux/features/user/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import useSocket from "@/socket/socket"
import axs from "@/utils/axios"
import { useEffect, useState } from "react"
import { Socket } from "socket.io-client"

const useCreateComment = (postId?: number, userSocket?: Socket) => {
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const user = useAppSelector(selectUser)

    const token = useAppSelector((state)=> state.auth.token)

    const socket = useSocket('comments')

    useEffect(()=> {
        if(socket){
            if(postId){
                socket.emit('joinPost', {postId: postId})
            }
            socket.on('messageCreated', (comment)=> {
                console.log('comment', comment)
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
                if(comment.notify2){
                    userSocket?.emit('sendNotification', {
                        id1: comment.notify1.id,
                        id2: comment.notify2.id
                    })
                }
                else if(comment.notify1) {
                    userSocket?.emit('sendNotification', {
                        id1: comment.notify1.id
                    })
                }
                
                dispatch(setCountComment({postId: comment.post.id}))
                
            })

            return ()=> {
                socket.off('commentCreated')
            }
        }


    }, [socket, dispatch])

    const createComment = async (postId: number, content: string, parentId?: string, commentId?: string | undefined, onlineSocket?: Socket) => {
        setLoading(true)
        try {
            if(socket && !parentId && !commentId){
                socket.emit('createComment', {
                    postId: postId,
                    content: content,
                    parentId: parentId,
                    replyId: commentId,
                    userId: user.id
                })
            }
            else {
                const {data} = await axs.post(`/comment/create-comment`, {
                    content: content,
                    parentId: parentId,
                    replyId: commentId,
                    postId: postId
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                console.log({
                    content: content,
                    parentId: parentId,
                    replyId: commentId,
                    postId: postId,
                    socket: onlineSocket
                })

                if(data){
                    console.log('data', data, onlineSocket)
                    dispatch(addReplyComment({
                        parentId: parentId || '',
                        commentId: data.id,
                        replyComment: data
                    }))
                    if(onlineSocket){
                        // console.log('userSocket', onlineSocket)
                        if(data.notify2){
                            onlineSocket?.emit('sendNotification', {
                                id1: data.notify1.id,
                                id2: data.notify2.id
                            })
                        }
                        else if(data.notify1) {
                            onlineSocket?.emit('sendNotification', {
                                id1: data.notify1.id
                            })
                        }
                    }
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