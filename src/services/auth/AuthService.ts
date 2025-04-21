import axios from "axios";
import apiClient from "../../config/axiosConfig";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as String
export const LoginUser = async (formData: {id:string, password:string}) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/signIn`, formData);

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const LogoutUser = async (refreshToken:string) => {
    try {
        const response = await apiClient.post(
            `${API_BASE_URL}/auth/logout`,
            {}, // 빈 요청 본문
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`, // Authorization 헤더에 refreshToken 추가
                },
            }
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const UserRegiste = async (formData: {
    userTp: string;
    username: string;
    email: string;
    phoneNumber: string;
    nickname: string;
    id: string;
    password: string;
    passwordChk: string;
    birthDate: string;
    agreeYn: string
})=> {
    try {
        const requestData = {
            ...formData,
            birthDate: formData.birthDate ? formData.birthDate.split('T')[0] : null,
        };

        const response = await apiClient.post(`${API_BASE_URL}/auth/register`, requestData);
        return response.data;
    } catch (error : any) {
        alert(error.response.data.message);
        return;
    }
}


export const IdDupChk = async (id: string) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/idDupChk`, null, { params: { id } });

        return response.data
    } catch (error) {
        throw error;
    }

}

export const NicknameDupChk = async (nickname: string) =>  {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/nicknameDupChk`, null, { params: { nickname } });

        return response.data;
    } catch (error) {
        throw error;
    }
}



export const EmailDupChk= async (email: string) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/emailDupChk`, null, { params: { email } });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export const PhoneNumberDupChk = async (phoneNumber: string) => {
    try {
        const response = await apiClient.post(`${API_BASE_URL}/auth/phoneNumberDupChk`, null, { params: { phoneNumber } });

        return response.data;
    } catch (error) {
        throw error
    }

}