import axios from "axios";

export const CmmCode= async  (sysCode: string) =>{
    try {
        const response = await axios.post("cmm/getCmmCode", null, { params: { sysCode } });

        return response.data;
    } catch (error) {
        throw error;
    }
}