import { StaticImageData } from "next/image";

export interface InputProps {
    placeholder: string,
    type: string,
    icon?: string,
    className?: string,
    width?: number,
    height?: number,
    right?: boolean,
    iconComponent?: any,
    onClick?: () => void,
    ref?: React.Ref<HTMLInputElement>,
    classInput?: string,
    value?: string,
    onChange?: (e: any) => void,
    tabIndex?: number,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

export interface ButtonProps {
    text?: string | null,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    icon?: any,
    className?: string,
    classNameText?: string,
    ref?: React.Ref<HTMLButtonElement>,
    width?: number,
    height?: number,
    type?: 'button' | 'reset' | 'submit',
    disabled?: boolean,
    iconLoading?: boolean,
    right?: boolean,
    left?: boolean,
}

export interface UserProps {
    id: string,
    fullName: string,
    avatar: string | null,
    username: string,
    isFollowing?: string
}

export interface UserState {
    id?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    gender?: string | null,
    email?: string | null,
    avatar: string | null,
    dob?: string | null,
    postCount?: number,
    followers: number
    followings: number,
    isFollow: string,
}

export interface logoProps {
    size?: string,
    width?: number,
    isLogo?: boolean,
    onClick?: () => void
}

export interface DropDownProps {
    tabIndex?: number,
    className?: string,
    classNameContent?: string,
    parents: any,
    children?: any,
    width?: string;
    position?: string;
  }

export interface AvatarProps {
    width: number,
    src?: string,
    alt: string,
    height: number,
    className?: string,
    id?: string | undefined,
    onClick?: ()=> void
}

export interface ModalProps {
    children?: any,
    title?: any,
    onClose?: () => void,
    closeIcon?: boolean,
    className?: string,
}

export interface PostState {
    id: number | null,
    description: string,
    created_ago: string,
    created_by: {
        id: string,
        fullName: string,
        avatar: string | null,
        username: string
    },
    images: string[],
    status: number,
    tags: string[] | null,
    reaction_count: number,
    comment_count: number,
    isReacted: boolean,
    reactionType: string,
    currentPage?: number,
    hasMore?: boolean,
}

export interface TabProps {
    tabs: [{title: string, content: any}]
}
export interface Reaction {
    reaction_id: string,
    reaction_type: string,
    user: {
        avatar: string | null,
        fullName: string,
        id: string,
        username: string
    }
}

export interface InteractProps {
    name: string;
    icon: StaticImageData | null;
    color: string;
}


export interface Comment {
    children: Array<Comment>,
    content: string,
    created_ago: string,
    created_by: {
        fullName: string,
        avatar: string,
        id: string
    },
    id: string,
    image?: string | null,
    reactionCount: number,
    reactionType: string,
    parentId?: string,
    commentCount: number,
}

export interface Message {
    id: string,
    content: string,
    created_ago: string,
    sender: UserProps,
    receiver: UserProps,
    idConversation: string
}

export interface Conversation {
    id: string,
    sender: UserProps,
    receiver: UserProps,
    lastMessage?: Message,
    messages: Message[],
    currentPage?: number,
    hasMore?: boolean
}