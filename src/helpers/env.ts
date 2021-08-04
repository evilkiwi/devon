import { outputFile } from 'fs-extra';
import { join } from 'path';
import { getServices } from './services';
import { cwd } from './cwd';

export const objToEnv = (obj: Record<string, unknown>) => {
    return Object.keys(obj).reduce<string>((str, key) => {
        return `${str}${key}="${obj[key]}"
`;
    }, '');
};

export const generateEnv = async (env: string) => {
    const { services } = await getServices();
    const dir = await cwd();

    await Object.keys(services).reduce(async (promise, name) => {
        await promise;

        const serviceEnv = services[name].config.env ?? {};
        const path = services[name].definition.path ?? name;

        await outputFile(join(dir, path, '.env'), objToEnv({
            ...(serviceEnv.default ?? {}),
            ...(serviceEnv[env] ?? {}),
        }));
    }, Promise.resolve());
};
