import { join } from 'path';
import type { Service, DefinitionFile, ServiceConfig } from '@/types';
import { config } from '@/config';
import { cwd } from './cwd';

export interface Result {
    definition: DefinitionFile;
    services: Record<string, {
        definition: Service;
        config: ServiceConfig;
    }>;
}

export const getServices = async (): Promise<Result> => {
    // Fetch the root definition file.
    const filename = config.get('definitionFile');
    const serviceFile = config.get('serviceFile');
    const dir = await cwd();
    const cfg = require(join(dir, filename));

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
        const fetch = require(path);

        if (fetch.config) {
            services[service.name] = {
                definition: service,
                config: fetch.config,
            };
        }
    }, Promise.resolve());

    return { definition, services };
};
