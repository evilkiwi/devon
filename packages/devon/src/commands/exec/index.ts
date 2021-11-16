import compose from 'docker-compose';
import { red } from 'chalk';
import ora from 'ora';
import type { CommandHandler } from '@/types';
import { config } from '@/config';
import { cwd } from '@/helpers';

export const run = async (service: string, command: string[]) => {
    const currentCompose = config.get('currentCompose');

    if (!currentCompose) {
        throw new Error('No containers running');
    }

    const dir = await cwd();
    const { out } = await compose.exec(service, command, {
        cwd: dir,
        configAsString: currentCompose.compose,
        log: false,
        env: {
            ...process.env,
            COMPOSE_PROJECT_NAME: currentCompose.project,
        },
    });

    return out;
};

export const register: CommandHandler = ({ program }) => {
    program.command('exec <service> <cmd...>')
        .action(async (service: string, cmd: string[]) => {
            const progress = ora(`Running "${cmd.join(' ')}" in "${service}"`).start();

            try {
                const out = await run(service, cmd);

                progress.stop();
                console.log(out);
            } catch (e) {
                progress.stop();
                console.log(red((e as Error).message));
            }
        });
};
