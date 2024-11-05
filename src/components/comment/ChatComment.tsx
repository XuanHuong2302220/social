// import React from 'react'
// import {Avatar, Button, DropDown, Interact} from '@/components'
// import { useAppSelector } from '@/redux/hooks'
// import { selectUser } from '@/redux/features/user/userSlice'
// import HighlightWithinTextarea from 'react-highlight-within-textarea'

// interface ChatCommentProps {
//     user: any,
//     fullName: string,
//     text: string,
//     loading: boolean,
//     commentRef: any,
//     textareaRef: any,
//     openEmoji: boolean,
//     emojiRef: any,
//     handleEmojiClick: (emojiObject: any) => void,
//     onChange: (e: any) => void,
//     handleSendComment: () => void,
//     handleKeyDown: (e: any) => void
// }

// const ChatComment = ({loading, fullName}: ChatCommentProps) => {

//     const user = useAppSelector(selectUser)

//   return (
//     <div className={`${loading && 'pointer-events-none opacity-25'} flex px-5 gap-2 items-start`}>
//     <Avatar 
//       width={10}
//       height={10}
//       className='w-10 h-10 '
//       src={user.avatar ?? ''}
//       alt={fullName}
//     />
//     <div id='textcomment' className='flex-1 w-[90%] bg-search px-3 rounded-2xl overflow-y-auto max-h-[400px]'>
//     <div onKeyDown={handleKeyDown}>
//       <HighlightWithinTextarea
//         value={text}
//         highlight={[{ highlight: /#[\w]+/g, className: 'text-blue-500 bg-transparent' }]}
//         onChange={onChange}
//         placeholder='write a comment...'
//       />
//     </div>
//         <div className='flex justify-end p-2 items-center'>
//           <div className={`absolute left-[86%] cursor-pointer`}>
//             <BsEmojiSmile onClick={()=> setOpenEmoji(!openEmoji)} />
//           </div>
//           <div ref={emojiRef}>
//             <EmojiPicker
//               open={openEmoji}
//               style={{position: 'absolute'}}
//               className='top-[265px] right-[76px] z-10'
//               width={300}
//               height={350}
//               theme={Theme.DARK}
//               onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)}
//             />
//           </div>
//           {loading ? <span className="loading loading-spinner loading-md"></span> :<IoMdSend className='text-xl cursor-pointer' onClick={handleSendComment} />}
//         </div>
//     </div>
//   </div>
//   )
// }

// export default ChatComment