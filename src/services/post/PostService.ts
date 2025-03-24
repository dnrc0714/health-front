import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String;

export const SavePost = async (formData: FormData)=> {
    try {
        const response = await axios.post(`${API_BASE_URL}/post/save`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${formData.get("refreshToken")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const GetPostList = async (postTp:string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/post/list?postTp=${postTp}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetPost = async (postId:number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/post/detail?postId=${postId}` );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const DeletePost = async (postId:number) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/post/delete?postId=${postId}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}
