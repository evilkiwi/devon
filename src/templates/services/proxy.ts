export const proxy = `import type { ServiceConfig } from '@casthub/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'nginx:latest',
        ports: ['80:80', '443:443'],
        volumes: [
            './{{dir}}/proxy/sites:/etc/nginx/conf.d',
            './{{dir}}/proxy/certs:/etc/ssl',
        ],
        restart: 'always',
    },
};
`;
