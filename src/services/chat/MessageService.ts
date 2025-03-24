import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;

export const getMessageList= (roomId: string) => {
    try {
        return axios.get(`${API_BASE_URL}/chat/${roomId}/messages?size=10`);
    } catch (error) {
        throw error;
    }
}