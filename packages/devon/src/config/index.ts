import Conf from 'conf';
import type { ConfigSchema } from '../types';
import pkg from '../../package.json';

export const config = new Conf<ConfigSchema>({
  projectName: 'devon',
  projectSuffix: 'evilkiwi',
  configName: 'config',
  fileExtension: 'json',
  clearInvalidConfig: true,
  accessPropertiesByDotNotation: true,
  projectVersion: pkg.version,
  schema: {
    dir: {
      type: 'string',
      default: '.devon',
      description: 'folder name for project-level storage',
    },
    definitionFile: {
      type: 'string',
      default: '.devon.ts',
      description: 'filename for project-level config',
    },
    serviceFile: {
      type: 'string',
      default: '.devconfig.ts',
      description: 'filename for service-level config',
    },
    dataFolder: {
      type: 'string',
      default: '.data',
      description: 'folder name inside `dir` where Docker partitions can reside (should be in .gitignore!)',
    },
    maxDepth: {
      type: 'number',
      default: 10,
      minimum: 1,
      maximum: 20,
      description: 'when running a `devon` command, we can traverse up to this many levels to find the project definition',
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
      description: 'the current compose config being served (do not edit!)',
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
      description: 'the current/last selected services mapped to each project for better UX (do not edit!)',
    },
  },
  migrations: {
    '1.1.0': store => {
      store.reset('currentCompose');
      store.reset('currentServices');
    },
  },
});
