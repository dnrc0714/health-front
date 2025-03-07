import React from "react";

type TpButtonProps = {
    code: string;
    codeName?: string;
    type: "button" | "submit" | "reset";
    isActive: boolean;
    onClick: () => void;
};

export default function TpButton({
                                     code,
                                     codeName,
                                     type,
                                     isActive,
                                     onClick,
                                 }: TpButtonProps) {
    return (
        <button
            key={code}
            type={type}
            onClick={onClick}
            className={`px-3 py-2 rounded-lg border transition duration-300 
        ${isActive ? "bg-blue-500 text-white font-bold border-blue-700 shadow-lg"
                : " text-gray-800 border-gray-400"}
      `}
        >
            #{codeName}
        </button>
    );
}