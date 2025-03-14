import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export default defineConfig({
    root: './', // index.html 위치 기준
    plugins: [
        react(),
    ],
    define: {
        'global': {},
    },
    build: {
        outDir: 'dist', // 빌드 후 결과물 폴더
        emptyOutDir: true, // 빌드 시 기존 파일 삭제
        rollupOptions: {
            input: './index.html', // 빌드할 HTML 파일
        },
        cssCodeSplit: true, // CSS 코드 분할 활성화
        minify: false, // CSS가 압축되지 않도록 설정
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    server: {
        port: 3000,
        proxy: {
            '/': 'http://localhost:8081', // 백엔드 API 경로
        },
    },
    base: '/', // base 옵션 추가 (이것이 빌드된 CSS 파일의 올바른 경로를 생성합니다)

});