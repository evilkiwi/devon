import { dump } from 'js-yaml';
import type { ServiceConfig } from '@/types';

// TODO: Typing docker-compose format?
export const compileCompose = (services: Record<string, ServiceConfig>) => {
    return dump(Object.keys(services).reduce<Record<string, any>>((config, name) => {
        const service = services[name];

        if (service.compose) {
            config[name] = service.compose;
        }

        return config;
    }, {}));
};
