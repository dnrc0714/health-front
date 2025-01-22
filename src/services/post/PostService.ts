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
export const GetPostList = async () => {
    try {
        const response = await axios.post('post/list');

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetPost = async (postId:bigint) => {
    try {
        const response = await axios.post('post/detail', postId);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const DeletePost = async (postId:bigint) => {
    try {
        const response = await axios.post('post/delete', postId);

        return response.data;
    } catch (error) {
        throw error;
    }
}
