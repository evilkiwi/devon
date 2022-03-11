import consola from 'consola';
import { join } from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import { cwd, generateCertificates, getServices } from '../../helpers';
import type { CommandHandler } from '../../types';

export const run = async () => {
    // Fetch the definition and service configs.
    const { definition } = await getServices();
    const dir = await cwd();

    // Ensure the domains exist.
    if (!definition.domains) {
        throw new Error('you have no `domains` defined in `.devon.ts`');
    }

    // Check the Certificates folder exists.
    const certs = join(dir, '.devon', 'proxy');
    let exists = false;

    try {
        const info = await fs.stat(join(certs, 'certs'));

        if (info.isDirectory()) {
            exists = true;
        }
    } catch {}

    if (!exists) {
        throw new Error('certificates folder does not exist');
    }

    // Generate the certificates for these domains.
    return generateCertificates(certs, definition.domains);
};

export const register: CommandHandler = ({ program }) => {
    program.command('gen-certs')
        .action(async () => {
            consola.log('');
            const running = ora('generating ssl certificates').start();

            try {
                await run();

                running.stop();
                consola.success('ssl certificates generated');
            } catch (e) {
                running.stop();
                consola.error(e as Error);
            }
        });
};
