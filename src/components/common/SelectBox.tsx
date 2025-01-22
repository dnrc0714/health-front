import React from "react";
import {useQuery} from "@tanstack/react-query";
import {CmmCode} from "../../services/cmm/CmmService";


type SelectBoxProps = {
    code:string;
    val:string;
    changeState: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    changeId:string
}
export default function SelectBox({code, changeId, changeState}:SelectBoxProps) {
    // TB: cmm_code > sys_code, changeId: selectBox id, changeState: change handler
    const {data, error} = useQuery({
        queryKey: ['sysCode', code],
        queryFn: () => CmmCode(code)
    });

    if(error) {
        return <div>error.message</div>;
    }

    return (
        <div>
            <select
                id={changeId}
                name={changeId}
                onChange={changeState}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
                {data?.map((item: { code: string; codeName: string }) => (
                     <option key={item.code} value={item.code}>
                         {item.codeName}
                     </option>
                ))}
            </select>
        </div>
    );
}