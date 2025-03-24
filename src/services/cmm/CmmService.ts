import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;


export const CmmCode= async  (sysCode: string) =>{
    try {
        const response = await axios.post(`${API_BASE_URL}/cmm/getCmmCode`, null, { params: { sysCode } });
        return response.data;
    } catch (error) {
        throw error;
    }
}

