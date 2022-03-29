import { dump } from 'js-yaml';
import type { ServiceConfig } from '../../types';
import { getServices } from '../services';

export const compileCompose = async (configs: Record<string, ServiceConfig>) => {
    const { definition } = await getServices();
    const version = definition.composeVersion ?? '3.9';
    const services = Object.keys(configs).reduce<Record<string, any>>((config, name) => {
        const service = configs[name];

        if (service.compose) {
            config[name] = service.compose;
        }

        return config;
    }, {});

    return dump({
        version,
        services,
        ...(definition.networks !== undefined ? {
            networks: definition.networks,
        } : {}),
    });
};
