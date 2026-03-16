import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
export default defineConfig({
    test: {
        globals: true,
        root: './',
        environment: 'node',
    },
    plugins: [
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
});
//# sourceMappingURL=vitest.config.js.map