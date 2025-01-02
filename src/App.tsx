import React, {useEffect, useState} from 'react';
import './styles/App.css';
import axios from "axios";

export default function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // 폼 제출 핸들러
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 페이지 리로드 방지

        // 입력값 검증 (간단한 예시)
        if (!username || !password || !email) {
            setErrorMessage('모든 필드를 입력해주세요.');
            return;
        }

        try {
            // POST 요청으로 백엔드 API 호출
            const response = await axios.post('http://localhost:8080/auth/register', {
                username,
                password,
                email
            });

            // 성공 메시지
            localStorage.setItem("token", response.data);
            setSuccessMessage('회원가입이 성공적으로 완료되었습니다!');
            setErrorMessage('');
        } catch (error) {
            // 오류 처리
            setErrorMessage('회원가입에 실패했습니다. 다시 시도해주세요.');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="사용자 이름"
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호"
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일"
                    />
                </div>

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}


