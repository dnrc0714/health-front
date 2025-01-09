import React from 'react';
import './styles/App.css';
import { HashRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Login from "./components/auth/Login";
import {useRecoilState} from "recoil";
import {authState} from "./utils/recoil/atoms";
import Register from "./components/auth/Register";
import Agreement from "./components/auth/Agreement";



export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState<boolean>(authState);
    return (
            <HashRouter>
                <div className="min-h-screen bg-gray-100">
                    <Header isLoggedIn={isLoggedIn}/>
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/agreement" element={<Agreement />} />
                    </Routes>
                </div>
            </HashRouter>
    );
}
