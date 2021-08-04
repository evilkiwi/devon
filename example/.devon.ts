import type { DefinitionFile } from '@casthub/devon';

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
        frontend: {
            desc: 'Run the dev build frontends',
            commands: [{
                name: 'app',
                command: 'yarn',
                args: ['workspace', '@example/app', 'dev'],
            }],
        },
        backend: {
            desc: 'Run the dev build for API backend',
            commands: [{
                name: 'api',
                command: 'yarn',
                args: ['workspace', '@example/api', 'dev'],
            }],
        },
    },
};
