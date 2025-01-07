import React, {useEffect, useState} from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import {useRecoilState} from "recoil";
import {authState} from "./utils/recoil/atoms";



export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState<boolean>(authState);
    return (
            <Router>
                <div className="min-h-screen bg-gray-100">
                    <Header isLoggedIn={isLoggedIn}/>
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn}/>} />
                    </Routes>
                </div>
            </Router>
    );
}
