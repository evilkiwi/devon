import type { Command } from 'commander';
import type Conf from 'conf';

export interface ConfigSchema {
    dir: string;
    definitionFile: string;
    serviceFile: string;
    dataFolder: string;
    maxDepth: number;
    currentCompose: {
        project: string;
        compose: string;
    }|null;
    currentServices: {
        project: string;
        services: string[];
    }[];
}

export interface CommandPayload {
    program: Command;
    config: Conf<ConfigSchema>;
}

export type CommandHandler = (payload: CommandPayload) => void;

export * from './definition';
