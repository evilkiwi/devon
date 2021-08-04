import type { ServiceConfig } from '@casthub/devon';

export const config: ServiceConfig = {
    env: {
        default: {
            VITE_TEST_1: 'hello-world',
        },
        local: {
            VITE_TEST_2: 'hello-world-2',
        },
    },
};
