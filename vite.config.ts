import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import * as path from 'path';

export default defineConfig({
    define: {
        'global': 'globalThis',
    },
    root: './', // index.html 위치 기준
    plugins: [
        react({
            include: "**/*.tsx"
        }),
        VitePWA({
            workbox: {
                cleanupOutdatedCaches: false,
                sourcemap: true,
                maximumFileSizeToCacheInBytes: 7000000,
            }
        })
    ],
    build: {
        outDir: '../../../build/resources/main/static',// '../resources/main/static', // 빌드 후 결과물 폴더 //
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
        host: true,
        proxy: {
            "/ws-stomp": {
                target: "http://localhost:8081",
                changeOrigin: true,
                ws: true, // WebSocket 활성화
            }
        },
        watch: {
            ignored: ['node_modules/**', 'public/**'],
            usePolling: true
        },
        fs: {
            strict: false,
        },
        hmr: {
            overlay: true, // 에러 발생 시 브라우저 화면에 오류 표시
            clientPort: 3000, // 프록시 사용 시 필요
            protocol: 'ws', // 웹소켓 강제 사용
        },
    },
    base: '/', // base 옵션 추가 (이것이 빌드된 CSS 파일의 올바른 경로를 생성합니다)

});