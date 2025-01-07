import React from "react";
import {useNavigate} from "react-router-dom";
import axios, {AxiosError} from "axios";
import {useResetRecoilState} from "recoil";
import {authState} from "../utils/recoil/atoms";

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
    const navigate = useNavigate();
    const logoutState = useResetRecoilState(authState);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                console.error('No refreshToken found in localStorage.');
                return;
            }

            // 서버에 로그아웃 요청
            const response = await axios.post(
                '/auth/logout',
                {}, // 빈 요청 본문
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`, // Authorization 헤더에 refreshToken 추가
                    },
                }
            )
            alert(response.data); // "로그아웃 되었습니다."

            // 클라이언트 측 토큰 제거
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            logoutState();

            navigate('/login'); // 로그인 페이지로 이동
        } catch (err) {
            const error = err as AxiosError; // 타입 단언
            alert('로그아웃 실패:' + error.response?.data || error.message);
        }
    };

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <header className="bg-blue-600 text-white p-4">
            <div className="flex justify-between items-center max-w-screen-lg mx-auto">
                <div
                    className="text-lg font-bold cursor-pointer"
                    onClick={() => handleNavigate('/')}
                >
                    Health
                </div>
                <div className="flex space-x-4">
                    <button
                        onClick={() => handleNavigate('/board')}
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        게시판
                    </button>
                    <button
                        onClick={() => handleNavigate('/schedule')}
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    >
                        운동 일정
                    </button>
                    {!isLoggedIn ? (
                        <button
                            onClick={() => handleNavigate('/login')}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            로그인
                        </button>
                    ) : (
                        <div className="flex space-x-4">
                            <button
                                onClick={() => handleNavigate('/mypage')}
                                className="bg-gray-800 text-white px-4 py-2 rounded"
                            >
                                마이페이지
                            </button>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                            >
                                로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}