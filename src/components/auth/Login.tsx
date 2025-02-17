import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {LoginUser} from "../../services/auth/AuthService";
import useForm from "../../hooks/useForm";
import Button from "../common/Button";
import Input from "../common/Input";


type FormType = {
    id:string;
    password:string
}

export default function Login({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {
    const formState= useForm({
        id:"",
        password:"",
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await LoginUser(formState.values as FormType);
            const [accessToken, refreshToken] = response; // 서버 응답에서 토큰 추출

            // 액세스 토큰과 리프레시 토큰을 localStorage에 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // 전역상태 RECOIL
            setIsLoggedIn(refreshToken);

            setError('');
            navigate('/');
        } catch (err) {
            alert("로그인에 실패했습니다.");
            alert(err);
        }
    };

    return (
        <div className="flex justify-center items-center bg-gray-100 h-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
                    handleLogin(); // 로그인 처리 함수 호출
                }}
                className="w-96 p-6 bg-white shadow-md rounded-lg"
            >
                <h2 className="text-3xl mb-4 text-center font-bold">CB HEALTH</h2>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex flex-col gap-2">
                    <Input
                        type={"text"}
                        id={"id"}
                        name={"id"}
                        value={formState.values.id}
                        onChange={formState.handleChange}
                        className={"input-text"}
                        maxLength={10}
                        placeholder={"아이디"}
                    />
                    <Input
                        type={"password"}
                        id={"password"}
                        name={"password"}
                        value={formState.values.password}
                        onChange={formState.handleChange}
                        className={"input-text"}
                        maxLength={20}
                        placeholder={"비밀번호"}
                    />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                    <Button label={'로그인'} type={'submit'} className={'apply-btn'}/>
                    <Button label={'회원가입'} type={'button'} className={'sec-btn'} onClick={() => navigate('/agreement')}/>
                </div>
            </form>
        </div>
    );
}