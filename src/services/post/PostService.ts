import axios from "axios";

export const SavePost = async (formData: FormData)=> {
    try {
        const response = await axios.post("/post/save", formData, {
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
        const response = await axios.get(`post/list?postTp=${postTp}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetPost = async (postId:number) => {
    try {
        const response = await axios.post(`post/detail?postId=${postId}` );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const DeletePost = async (postId:number) => {
    try {
        const response = await axios.post(`post/delete?postId=${postId}`);

        return response.data;
    } catch (error) {
        throw error;
    }
}
