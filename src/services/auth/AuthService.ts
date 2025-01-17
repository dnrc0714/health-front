import axios from "axios";


export async function Login(username: string, password: string) {
    return await axios.post('/auth/login', {
        username,
        password,
    });
}

export async function  Logout(refreshToken:string) {
    return await axios.post(
        '/auth/logout',
        {}, // 빈 요청 본문
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`, // Authorization 헤더에 refreshToken 추가
            },
        }
    );
}

export async function  Registe(formData:FormData){
    return await axios.post('/auth/register', formData);
}

export async function  IdDupChk(userId: string) {
    return await axios.post('/auth/idDupChk', null, { params: { userId } });
}

export async function  NicknameDupChk(nickname: string) {
    return await axios.post('/auth/nicknameDupChk', null, { params: { nickname } });
}

export async function  EmailDupChk(email: string) {
    return await axios.post('/auth/emailDupChk', null, { params: { email } });
}

export async function  PhoneNumberDupChk(phoneNumber: string) {
    return await axios.post('/auth/phoneNumberDupChk', null, { params: { phoneNumber } });
}