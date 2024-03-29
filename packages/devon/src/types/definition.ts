import type { DefinitionsService, DefinitionsNetwork, DefinitionsVolume } from './generated';

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

export type EnvVars = Record<string, unknown>;

export interface DefinitionFile {
  project: string;
  domains?: string[];
  services: Service[];
  environments: Environment[];
  scripts?: Record<string, Script>;
  networks?: Record<string, DefinitionsNetwork>;
  volumes?: Record<string, DefinitionsVolume>|string[];
  composeVersion?: string;
}

export interface ServiceConfig {
  env?: {
    [env: string]: EnvVars;
  };
  compose?: DefinitionsService;
}
