import { release, platform } from 'os';
import { pathExists } from 'fs-extra';
import { join, resolve } from 'path';
import sudo from 'sudo-prompt';
import consola from 'consola';
import ora from 'ora';
import type { CommandHandler } from '../../types';
import { config } from '../../config';
import { cwd } from '../../helpers';

export const run = async () => {
    const path = await cwd();
    const dir = config.get('dir');
    const dataPath = join(path, dir);
    const proxyPath = join(dataPath, 'proxy');

    // Install the CA certificate if it exists.
    const certsExists = await pathExists(join(proxyPath, 'certs', 'rootCA.pem'));

    if (!certsExists) {
        throw new Error('this monorepo has no certificates to install');
    }

    // Check if they're running macOS 11+, since it has trouble installing via this method.
    if (platform() === 'darwin' && release().charAt(0) === '2') {
        return [
            `macOS 11+ users must manually install the certificate chain - please run this command: \`sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ${resolve(proxyPath, 'certs', 'rootCA.pem')}\``,
            'after this, you\'re all done!',
        ];
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
            const install = ora('installing').start();

            try {
                const result = await run();
                install.stop();

                if (typeof result === 'string' || Array.isArray(result)) {
                    (Array.isArray(result) ? result : [result]).forEach(text => {
                        consola.info(text);
                    });
                } else {
                    consola.success('awesome! everything is installed and ready-to-go');
                    consola.log('');
                    consola.log('run `devon switch` to get started!');
                }
            } catch (e) {
                install.stop();
                consola.error(e as Error);
            }
        });
};
