import React, {useEffect, useState} from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Login from "./components/Login";



export default function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Header />
                <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}
