import type { DefinitionFile } from '@oyed/devon';

export const config: DefinitionFile = {
    project: 'example',
    services: [{
        name: 'api',
    }, {
        name: 'app',
    }, {
        name: 'redis',
        path: '.devon/redis',
        force: true,
    }, {
        name: 'proxy',
        path: '.devon/proxy',
        force: true,
    }, {
        name: 'mysql8',
        path: '.devon/mysql8',
        force: true,
    }],
    environments: [{
        name: 'local',
        desc: 'Use your local machine',
    }],
    scripts: {
        frontends: {
            desc: 'Run the frontend dev builds',
            commands: [{
                name: 'api',
                command: 'yarn',
                args: ['workspace', '@example/api', 'dev'],
            }, {
                name: 'app',
                command: 'yarn',
                args: ['workspace', '@example/app', 'dev'],
            }],
        },
    },
};
