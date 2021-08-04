import Conf from 'conf';
import type { ConfigSchema } from '@/types';

export const config = new Conf<ConfigSchema>({
    configName: 'config',
    fileExtension: 'json',
    clearInvalidConfig: true,
    accessPropertiesByDotNotation: true,
    schema: {
        dir: {
            type: 'string',
            default: '.devon',
        },
        definitionFile: {
            type: 'string',
            default: '.devon.ts',
        },
        serviceFile: {
            type: 'string',
            default: '.devconfig.ts',
        },
        dataFolder: {
            type: 'string',
            default: '.data',
        },
        maxDepth: {
            type: 'number',
            default: 10,
            minimum: 1,
            maximum: 20,
        },
        currentCompose: {
            type: 'string',
            default: '',
        },
        currentServices: {
            type: 'array',
            default: [],
        },
    },
});
