import type { ServiceConfig } from '@tnotifier/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'nginx:latest',
        ports: ['80:80', '443:443'],
        volumes: [
            './.devon/proxy/sites:/etc/nginx/conf.d',
            './.devon/proxy/certs:/etc/ssl',
        ],
        restart: 'always',
    },
};
