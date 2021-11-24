import type { ServiceConfig } from '@tnotifier/devon';

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
            './.devon/.data/mysql8:/var/lib/mysql',
        ],
        restart: 'always',
    },
};
