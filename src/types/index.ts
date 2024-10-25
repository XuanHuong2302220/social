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
    tabIndex?: number
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

export interface UserState {
    id?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    gender?: string | null,
    email?: string | null,
    avatar?: string | null,
    dob?: string | null,
}

export interface logoProps {
    size?: string,
    width?: number,
    isLogo?: boolean,
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
    onClick?: ()=> void
}

export interface ModalProps {
    children: any,
    title: any,
    onClose?: () => void,
    closeIcon?: boolean,
    className?: string,
}

export interface PostState {
    id: number | null,
    description: string,
    created_by: {
        id: string,
        fullName: string,
        avatar: string | null,
    },
    images: string[],
    status: number,
    tags: string[] | null,
    likes: number,
    comments: number,
}