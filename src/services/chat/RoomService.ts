import axios from "axios";
import apiClient from "../../config/axiosConfig";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;

export const getRoomList= () => {
    try {
        return apiClient.get(`${API_BASE_URL}/rooms?size=10`);
    } catch (error) {
        throw error;
    }
}

export const fetchRoomList = (currentPage:number) => {
    try {
        return apiClient.get(`${API_BASE_URL}/rooms?page=${currentPage}&size=10`);
    } catch (error) {
        throw error;
    }
}