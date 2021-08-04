import { green, red } from 'chalk';
import sudo from 'sudo-prompt';
import { join } from 'path';
import ora from 'ora';
import type { CommandHandler } from '@/types';
import { cwd } from '@/helpers';
import { pathExists } from 'fs-extra';

export const installCommand: CommandHandler = ({ config, program }) => {
    program.command('install')
        .action(async () => {
            const path = await cwd();
            const dir = config.get('dir');
            const dataPath = join(path, dir);
            const proxyPath = join(dataPath, 'proxy');

            const install = ora('Installing').start();

            try {
                // Install the CA certificate if it exists.
                const certsExists = await pathExists(join(proxyPath, 'certs', 'rootCA.pem'));

                if (certsExists) {
                    install.text = 'Installing CA Certificates';

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

                install.stop();
                console.log('');
                console.log(green('You are ready-to-go!'));
            } catch (e) {
                install.stop();
                console.log('');
                console.log(red('Could not install:', e));
            }
        });
};
