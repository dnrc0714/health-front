import axios from "axios";
import {ChatFileType} from "../../types/chatFileType";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;

export const saveFile = (chatFiles:ChatFileType) => {
    try {
        const formData = new FormData();
        formData.append("type", chatFiles.type);

        if(chatFiles.file != null) {
            formData.append("file", chatFiles.file); // 단일 파일
        }

        if(chatFiles.files != null) {
            chatFiles.files.forEach((file) => {
                formData.append("files", file);
            });
        }

        console.log([...formData.entries()]); // FormData 내부 확인


        return axios.post(`${API_BASE_URL}/files/${chatFiles.roomId}`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${localStorage.getItem("refreshToken")}` // 액세스 토큰 사용
            },

        });
    } catch (error) {
        throw error;
    }
}