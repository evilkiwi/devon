import Conf from 'conf';
import pkg from '../../package.json';
import type { ConfigSchema } from '@/types';

export const config = new Conf<ConfigSchema>({
    projectName: 'devon',
    projectSuffix: 'casthub',
    configName: 'config',
    fileExtension: 'json',
    clearInvalidConfig: true,
    accessPropertiesByDotNotation: true,
    projectVersion: pkg.version,
    schema: {
        dir: {
            type: 'string',
            default: '.devon',
            description: 'Folder name for project-level storage',
        },
        definitionFile: {
            type: 'string',
            default: '.devon.ts',
            description: 'Filename for project-level config',
        },
        serviceFile: {
            type: 'string',
            default: '.devconfig.ts',
            description: 'Filename for service-level config',
        },
        dataFolder: {
            type: 'string',
            default: '.data',
            description: 'Folder name inside `dir` where Docker partitions can reside (Should be in .gitignore!)',
        },
        maxDepth: {
            type: 'number',
            default: 10,
            minimum: 1,
            maximum: 20,
            description: 'When running a `devon` command, we can traverse up to this many levels to find the project definition',
        },
        currentCompose: {
            type: ['object', 'null'],
            default: null,
            properties: {
                project: {
                    type: 'string',
                },
                compose: {
                    type: 'string',
                },
            },
            description: 'The current compose config being served (Do not edit)',
        },
        currentServices: {
            type: 'array',
            default: [],
            items: {
                type: 'object',
                properties: {
                    project: {
                        type: 'string',
                    },
                    services: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                },
            },
            description: 'The current/last selected services mapped to each project for better UX (Do not edit)',
        },
    },
    migrations: {
        '1.1.0': store => {
            store.reset('currentCompose');
            store.reset('currentServices');
        },
    },
});
