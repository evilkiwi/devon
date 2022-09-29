export const mysql8 = `import type { ServiceConfig } from '@oyed/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'mysql:8',
        ports: ['33061:3306'],
        environment: {
            MYSQL_ROOT_PASSWORD: 'secret',
            MYSQL_DATABASE: 'default',
            MYSQL_USER: 'me',
            MYSQL_PASSWORD: 'secret',
        },
        volumes: [
            './{{dir}}/{{dataFolder}}/mysql:/var/lib/mysql',
        ],
        restart: 'always',
    },
};
`;

export const mysql5 = `import type { ServiceConfig } from '@oyed/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'mysql:5.7',
        ports: ['33061:3306'],
        environment: {
            MYSQL_ROOT_PASSWORD: 'secret',
            MYSQL_DATABASE: 'default',
            MYSQL_USER: 'me',
            MYSQL_PASSWORD: 'secret',
        },
        volumes: [
            './{{dir}}/{{dataFolder}}/mysql:/var/lib/mysql',
        ],
        restart: 'always',
    },
};
`;
