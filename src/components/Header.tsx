import React, {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        navigate('/login');
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