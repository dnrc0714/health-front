import React from "react";
import TpButton from "./TpButton";
import {useQuery} from "@tanstack/react-query";
import {CmmCode} from "../../../services/cmm/CmmService";
import useCode from "../../../hooks/useType";

type TpButtonProps = {
    code:string;
    onSelect?: (code: string) => void;
}

export default function TpButtonList({code, onSelect}:TpButtonProps) {
    const { selectedType, toggleType } = useCode();
    const {data, error} = useQuery({
        queryKey: ['sysCode', code],
        queryFn: () => CmmCode(code),
    });

    return(
    <div className="grid grid-cols-4 gap-2">
        {data?.map((item: { code: string; codeName: string }, index: number) => (
            <TpButton
                key={item.code}
                code={item.code}
                codeName={item.codeName}
                type={"button"}
                isActive={selectedType?.code === item.code || (!selectedType && index === 0)} // 객체 비교
                onClick={() => {
                    toggleType(item);
                    onSelect?.(item.code); // 버튼 클릭 시 부모(PostList)에도 전달
                }}
            />
        ))}
    </div>
    );
}