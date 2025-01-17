import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios, {AxiosError} from "axios";
import {useResetRecoilState} from "recoil";
import {authState} from "../utils/recoil/atoms";
import {IconButton, Tooltip} from "@mui/material";
import {AccountCircle, CalendarMonth, Forum, Login, Logout} from "@mui/icons-material";
import Sidebar from "./Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import {logout} from "../services/auth/AuthService";

export default function Header() {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false); // 사이드바 열기/닫기 상태 관리
    const logoutState = useResetRecoilState(authState);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                console.error('No refreshToken found in localStorage.');
                return;
            }

            // 서버에 로그아웃 요청
            const response = logout(refreshToken);
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
        setSidebarOpen(false);
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(prev => !prev);
    };

    return (
        <header className="bg-black text-white p-4 fixed top-0 left-0 w-full z-50 shadow-md">
            <div className="flex justify-between items-center w-full max-w-screen">
                {/* 좌측 상단: 더보기 버튼 */}
                <div className="lg:hidden">
                    <Tooltip title="더보기" arrow>
                        <IconButton
                            color="primary"
                            onClick={handleSidebarToggle}
                            sx={{ fontSize: '2rem' }}
                        >
                            <MenuIcon sx={{ fontSize: 'inherit' }}/>
                        </IconButton>
                    </Tooltip>
                </div>

                {/* 중앙 로고: 화면 크기가 줄어들면 중앙 배치 */}
                <div className="text-center lg:text-left">
                    <div
                        className="text-3xl font-bold cursor-pointer w-fit"
                        onClick={() => handleNavigate('/')}
                    >
                        HEALTH
                    </div>
                </div>

                {/* 게시판 버튼 */}
                <div className="hidden md:flex">
                    <Tooltip title="게시판" arrow>
                        <IconButton
                            color="primary"
                            sx={{ fontSize: '2rem' }}
                            onClick={() => handleNavigate('/post')}
                        >
                            <Forum sx={{ fontSize: 'inherit' }}/>
                        </IconButton>
                    </Tooltip>

                    {/* 운동 일정 버튼 */}
                    <Tooltip title="운동 일정" arrow>
                        <IconButton
                            color="primary"
                            sx={{ fontSize: '2rem' }}
                            onClick={() => handleNavigate('/schedule')}
                        >
                            <CalendarMonth sx={{ fontSize: 'inherit' }}/>
                        </IconButton>
                    </Tooltip>
                </div>
                {/* 우측 상단: 마이페이지, 로그인, 로그아웃 버튼 */}
                <div className="flex space-x-4 items-center">
                    {/* 마이페이지 버튼 (로그인 상태일 때만) */}
                    {localStorage.getItem('refreshToken') ? (
                        <Tooltip title="마이페이지" arrow>
                            <IconButton
                                color="primary"
                                sx={{ fontSize: '2rem' }}
                                onClick={() => handleNavigate('/mypage')}
                            >
                                <AccountCircle sx={{ fontSize: 'inherit' }}/>
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="로그인" arrow>
                            <IconButton
                                color="info"
                                sx={{ fontSize: '2rem' }}
                                onClick={() => handleNavigate('/login')}
                            >
                                <Login sx={{ fontSize: 'inherit' }}/>
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* 로그아웃 버튼 (로그인 상태일 때만) */}
                    {localStorage.getItem('refreshToken') && (
                        <div className="hidden md:flex">
                            <Tooltip title="로그아웃" arrow>
                                <IconButton
                                    color="error"
                                    sx={{ fontSize: '2rem' }}
                                    onClick={handleLogout}
                                >
                                    <Logout sx={{ fontSize: 'inherit' }}/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>

            {/* 사이드바 (더보기 버튼 클릭 시 열림) */}
            <Sidebar
                handleNavigate={handleNavigate}
                isLoggedIn={!!localStorage.getItem('refreshToken')}
                handleLogout={handleLogout}
                handleSidebarToggle={handleSidebarToggle}
                isSidebarOpen={isSidebarOpen}
            />
        </header>
    );
}