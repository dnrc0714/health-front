import React from "react"

type InputProps = {
    type:string;
    id:string;
    name:string;
    value:string;
    onChange:React.ChangeEventHandler<HTMLInputElement>;
    className:string;
    maxLength?: number
    placeholder?: string
}

export default function Input({type, id, name, value, onChange, className, maxLength, placeholder}:InputProps) {

    return (
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            className={className}
            maxLength={maxLength}
            placeholder={placeholder}
        />
    );
}