import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            proxy: {
                '/api': {
                    target: 'https://49.13.207.208',
                    changeOrigin: true,
                    secure: false,
                    rewrite: (path) => path.replace(/^\/api/, '/api/v1')
                }
            }
        }
    };
});
