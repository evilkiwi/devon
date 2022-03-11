import { join } from 'path';
import fs from 'fs-extra';
import { getServices } from '../services';
import { cwd } from '../cwd';

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
        const compiledEnv = {
            ...(serviceEnv.default ?? {}),
            ...(serviceEnv[env] ?? {}),
        };

        if (Object.keys(compiledEnv).length) {
            await fs.outputFile(join(dir, path, '.env'), objToEnv(compiledEnv));
        }
    }, Promise.resolve());
};
