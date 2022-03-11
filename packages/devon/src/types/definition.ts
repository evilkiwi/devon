export interface Service {
    name: string;
    path?: string;
    desc?: string;
    force?: boolean;
    color?: string;
}

export interface Environment {
    name: string;
    desc?: string;
}

export interface Command {
    name: string;
    command: string;
    args: string[];
}

export interface Script {
    commands: Command[];
    desc?: string;
}

export interface Network {
    name?: string;
    driver: string;
    driver_opts?: Record<string, unknown>;
    [key: string]: unknown;
}

export type EnvVars = Record<string, unknown>;

export interface DefinitionFile {
    project: string;
    domains?: string[];
    services: Service[];
    environments: Environment[];
    scripts?: Record<string, Script>;
    networks?: Record<string, Network>;
    composeVersion?: string;
}

export interface ServiceConfig {
    env?: {
        [env: string]: EnvVars;
    };
    compose?: any; // TODO: Find decent typings for various Compose versions
}
