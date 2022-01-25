import { release, platform } from 'os';
import { pathExists } from 'fs-extra';
import { join, resolve } from 'path';
import { green, red } from 'chalk';
import sudo from 'sudo-prompt';
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

    if (!certsExists) {
        throw new Error('This monorepo has no certificates to install.');
    }

    // Check if they're running macOS 11+, since it has trouble installing via this method.
    if (platform() === 'darwin' && release().charAt(0) === '2') {
        throw new Error(`macOS 11+ users must manually install the certificate chain - please run this command: \`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${resolve(proxyPath, 'certs', 'rootCA.pem')}\``);
    }

    return new Promise<void>((resolve, reject) => {
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
};

export const register: CommandHandler = ({ program }) => {
    program.command('install')
        .action(async () => {
            const install = ora('Installing').start();

            try {
                await run();

                install.stop();
                console.log(green('Awesome! Everything is installed and ready-to-go.'));
                console.log('');
                console.log('Run `devon switch` to get started!');
            } catch (e) {
                install.stop();
                console.log(red((e as Error).message));
            }
        });
};
