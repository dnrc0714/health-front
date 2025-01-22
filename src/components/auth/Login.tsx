import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {LoginUser} from "../../services/auth/AuthService";




export default function Login({ setIsLoggedIn }: { setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [formData, setFormData] = useState({
        id:"",
        password:"",
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await LoginUser(formData);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

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
                <input
                    name="id"
                    type="text"
                    placeholder="아이디"
                    value={formData.id}
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="비밀번호"
                    onChange={handleChange}
                    className="w-full p-2 mb-3 border border-gray-300 rounded"
                />
                <div className="flex items-center justify-between gap-2">
                    <button
                        type="submit" // 폼 제출 버튼
                        className="w-full p-2 bg-blue-500 text-white rounded"
                    >
                        로그인
                    </button>
                    <button
                        type="button" // 폼과 독립적인 동작 버튼
                        onClick={() => navigate('/agreement')}
                        className="w-full p-2 bg-pink-500 text-white rounded"
                    >
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    );
}