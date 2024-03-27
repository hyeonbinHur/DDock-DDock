import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        host: true,
        headers: {
            'Cross-Origin-Opener-Policy': '',
            'Cross-Origin-Embedder-Policy': '',
        },
    },
});
