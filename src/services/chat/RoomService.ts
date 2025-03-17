import axios from "axios";

export const getRoomList= () => {
    try {
        return axios.get(`http://localhost:8081/api/v1/rooms?size=10`);
    } catch (error) {
        throw error;
    }
}

export const fetchRoomList = (currentPage:number) => {
    try {
        return axios.get(`http://localhost:8081/api/v1/rooms?page=${currentPage}&size=10`);
    } catch (error) {
        throw error;
    }
}