import React from 'react';
import './styles/App.css';
import { HashRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import {useRecoilState} from "recoil";
import {authState} from "./utils/recoil/atoms";
import PostList from "./components/post/PostList";
import PostWrite from "./components/post/PostWrite";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AgreementPage from "./pages/auth/Agreement";


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState<boolean>(authState);
    return (
            <HashRouter>
                <div className="min-h-screen bg-gray-100">
                    <Header/>
                    <div className="pt-16 min-h-screen bg-gray-100">
                        <Routes>
                            <Route path="/" element={<MainContent/>}/>
                            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>}/>
                            <Route path="/post" element={<PostList/>}/>
                            <Route path="/post/write" element={<PostWrite/>}/>
                            <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn}/>}/>
                            <Route path="/agreement" element={<AgreementPage/>}/>
                        </Routes>
                    </div>
                </div>
            </HashRouter>
);
}
