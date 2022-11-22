import type { ServiceConfig } from '@evilkiwi/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'redis',
        ports: ['63791:6379'],
        volumes: [
            './.devon/.data/redis:/data',
        ],
        restart: 'always',
    },
};
