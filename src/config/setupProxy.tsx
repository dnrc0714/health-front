const { createProxyMiddleware } = require('http-proxy-middleware');
import { Application } from 'express';

export default function setupProxy(app: Application): void {
    app.use(
        '/auth',
        createProxyMiddleware({
            target: 'http://localhost:8081', // 서버 URL 또는 localhost:설정한 포트번호
            changeOrigin: true,
        })
    );
}