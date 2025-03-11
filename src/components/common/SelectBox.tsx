import React, {useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {CmmCode} from "../../services/cmm/CmmService";


type SelectBoxProps = {
    code:string;
    val:string;
    changeState: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    changeId:string
    mode?: "view" | "edit" | "create"
    postTp?: string
}

export default function SelectBox({code, changeId, changeState, val, mode, postTp}:SelectBoxProps) {
    const {data, error} = useQuery({
        queryKey: ['sysCode', code],
        queryFn: () => CmmCode(code),
    });

    // 첫 번째 아이템을 기본값으로 설정
    useEffect(() => {
        if (data && data.length > 0 && !val) {
            changeState({
                target: { name: changeId, value: postTp || data[0].code},
            } as React.ChangeEvent<HTMLSelectElement>);
        }
    }, [data, val, changeId, changeState]);

    if(error) {
        return <div>error.message</div>;
    }

    return (
        <div>
            <select
                id={changeId}
                name={changeId}
                value={val}
                onChange={changeState}
                disabled={mode == 'view'}
                className="select-box"
            >
                {data?.map((item: { code: string; codeName: string }) => (
                     <option key={item.code} value={item.code}>
                         {item.codeName}
                     </option>
                        )
                    )
                }
            </select>
        </div>
    );
}