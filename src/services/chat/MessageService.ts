import axios from "axios";

export const getMessageList= (roomId: string) => {
    try {
        return axios.get(`${import.meta.env.VITE_WEB_API_URL}/chat/${roomId}/messages?size=10`);
    } catch (error) {
        throw error;
    }
}