import type { Service, DefinitionFile, ServiceConfig } from '../../types';

export interface Result {
    definition: DefinitionFile;
    services: Record<string, {
        definition: Service;
        config: ServiceConfig;
    }>;
}
