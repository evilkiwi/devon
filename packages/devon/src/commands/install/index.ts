import { pathExists } from 'fs-extra';
import { green, red } from 'chalk';
import sudo from 'sudo-prompt';
import { join } from 'path';
import ora from 'ora';
import type { CommandHandler } from '@/types';
import { config } from '@/config';
import { cwd } from '@/helpers';

export const run = async () => {
    const path = await cwd();
    const dir = config.get('dir');
    const dataPath = join(path, dir);
    const proxyPath = join(dataPath, 'proxy');

    // Install the CA certificate if it exists.
    const certsExists = await pathExists(join(proxyPath, 'certs', 'rootCA.pem'));

    if (certsExists) {
        await new Promise<void>((resolve, reject) => {
            sudo.exec('mkcert -install', {
                name: 'devon',
                env: {
                    CAROOT: join(proxyPath, 'certs'),
                },
            }, err => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve();
            });
        });
    }
};

export const register: CommandHandler = ({ config, program }) => {
    program.command('install')
        .action(async () => {
            const install = ora('Installing').start();

            try {
                await run();

                install.stop();
                console.log(green('You are ready-to-go!'));
            } catch (e) {
                install.stop();
                console.log(red((e as Error).message));
            }
        });
};
