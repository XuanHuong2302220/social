import { FieldValues, UseFormRegister } from "react-hook-form";

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
    ref?: React.Ref<HTMLInputElement>;
}

export interface ButtonProps {
    text: string | null,
    onClick?: () => void
    icon?: string,
    className?: string,
    classNameText?: string,
    width?: number,
    height?: number,
    type?: 'button' | 'reset' | 'submit',
    disabled?: boolean,
    iconLoading?: boolean
}

export interface UserState {
    username: string,
    firstName: string,
    lastName: string,
    gender: string | null,
    email: string,
    avatar: string | null,
    dob?: string | null,
}