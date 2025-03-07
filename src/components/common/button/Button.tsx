import React from "react";

type buttonProps = {
    type?: "button" | "submit" | "reset";
    label:string;
    className?: string;
    onClick?: () => void; // 선택적 onClick 이벤트 핸들러
}
export default function Button({type, label, className, onClick}:buttonProps) {
    return (
        <button
            type={type}
            className={className}
            onClick={onClick}
        >
            {label}
        </button>
    );
}