import compose from 'docker-compose';
import { green, red } from 'chalk';
import ora from 'ora';
import type { CommandHandler } from '@/types';
import { config } from '@/config';
import { cwd } from '@/helpers';

export const downCommand = async () => {
    const existingCompose = config.get('currentCompose');
    const dir = await cwd();

    if (existingCompose.length) {
        await compose.down({
            cwd: dir,
            configAsString: existingCompose,
            log: false,
            commandOptions: ['--remove-orphans'],
        });

        config.set('currentCompose', '');
        config.set('currentServices', []);
    }
};

export const registerDown: CommandHandler = ({ program }) => {
    program.command('down')
        .action(async () => {
            const running = ora('Pulling down previous containers').start();

            try {
                await downCommand();

                running.stop();
                console.log(green('All containers downed'));
            } catch (e) {
                running.stop();
                console.error(red(e.message));
            }
        });
};
