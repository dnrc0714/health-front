import apiClient from "../../config/axiosConfig";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;

export const getMessageList= (roomId: string, currentPage: number) => {
    try {
        return apiClient.get(`${API_BASE_URL}/chat/${roomId}/messages?page=${currentPage}&size=10`);
    } catch (error) {
        throw error;
    }
}

export const getMessageInitList= (roomId: string) => {
    try {
        return apiClient.get(`${API_BASE_URL}/chat/${roomId}/messages?size=10`);
    } catch (error) {
        throw error;
    }
}