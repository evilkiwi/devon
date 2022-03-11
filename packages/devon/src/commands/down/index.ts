import compose from 'docker-compose';
import consola from 'consola';
import ora from 'ora';
import type { CommandHandler } from '../../types';
import { config } from '../../config';
import { cwd } from '../../helpers';

export const run = async () => {
    const existingCompose = config.get('currentCompose');
    const dir = await cwd();

    if (existingCompose) {
        try {
            await compose.down({
                configAsString: existingCompose.compose,
                commandOptions: ['--remove-orphans'],
                env: {
                    ...process.env,
                    COMPOSE_PROJECT_NAME: existingCompose.project,
                },
                cwd: dir,
                log: false,
            });
        } catch (e) {
            consola.error(e as Error);
        }

        config.set('currentCompose', null);
    }
};

export const register: CommandHandler = ({ program }) => {
    program.command('down')
        .action(async () => {
            const running = ora('pulling down previous containers').start();

            try {
                await run();
                running.stop();
                consola.success('all containers downed');
            } catch (e) {
                running.stop();
                consola.error(e as Error);
            }
        });
};
