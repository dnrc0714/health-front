import axios from "axios";

export const getRoomList= () => {
    try {
        return axios.get(`rooms?size=10`);
    } catch (error) {
        throw error;
    }
}

export const fetchRoomList = (currentPage:number) => {
    try {
        return axios.get(`rooms?page=${currentPage}&size=10`);
    } catch (error) {
        throw error;
    }
}