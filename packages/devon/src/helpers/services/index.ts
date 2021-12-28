import { join } from 'path';
import type { Service, DefinitionFile, ServiceConfig } from '@/types';
import { config } from '@/config';
import { cwd } from '../cwd';
import type { Result } from './types';

export const getServices = async (): Promise<Result> => {
    // Fetch the root definition file.
    const filename = config.get('definitionFile');
    const serviceFile = config.get('serviceFile');
    const dir = await cwd();
    let cfg: any = {};

    try {
        cfg = require(join(dir, filename));
    } catch (e) {
        throw new Error(`Could not find a ${filename} file`);
    }

    if (!cfg?.config) {
        throw new Error('Root definition file not defined correctly');
    }

    const definition: DefinitionFile = cfg.config;
    const services: Record<string, {
        definition: Service;
        config: ServiceConfig;
    }> = {};

    // Fetch the configs for each individual service.
    await definition.services.reduce(async (promise, service) => {
        await promise;

        const path = join(dir, service.path ?? service.name, serviceFile);

        try {
            const fetch = require(path);

            if (fetch.config) {
                services[service.name] = {
                    definition: service,
                    config: fetch.config,
                };
            }
        } catch {
            throw new Error(`Could not include service @ ${path}`);
        }
    }, Promise.resolve());

    return { definition, services };
};
