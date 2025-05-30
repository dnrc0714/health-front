import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './config/reportWebVitals';
import { RecoilRoot } from 'recoil';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <RecoilRoot>
        {/* <React.StrictMode> */}
        <App />
        {/* </React.StrictMode> */}
    </RecoilRoot>
);
reportWebVitals();