import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;

export const getRoomList= () => {
    try {
        return axios.get(`${API_BASE_URL}/rooms?size=10`);
    } catch (error) {
        throw error;
    }
}

export const fetchRoomList = (currentPage:number) => {
    try {
        return axios.get(`${API_BASE_URL}/rooms?page=${currentPage}&size=10`);
    } catch (error) {
        throw error;
    }
}