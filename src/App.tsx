import React from 'react';
import './styles/App.css';
import { HashRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import {useRecoilState} from "recoil";
import {authState} from "./utils/recoil/atoms";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AgreementPage from "./pages/auth/Agreement";
import PostListPage from "./pages/post/PostListPage";
import PostWritePage from "./pages/post/PostWritePage";
import Footer from "./components/Footer";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useRecoilState<boolean>(authState);
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <HashRouter>
                <div className="min-h-screen bg-gray-100">
                    <Header/>
                    <div className="mt-20 mb-10 min-h-screen bg-gray-100">
                        <Routes>
                            <Route path="/" element={<MainContent/>}/>
                            <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>}/>
                            <Route path="/post" element={<PostListPage/>}/>
                            <Route path="/post/write" element={<PostWritePage/>}/>
                            <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn}/>}/>
                            <Route path="/agreement" element={<AgreementPage/>}/>
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </HashRouter>
        </QueryClientProvider>
);
}
