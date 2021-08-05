import compose from 'docker-compose';
import { red } from 'chalk';
import ora from 'ora';
import type { CommandHandler } from '@/types';
import { config } from '@/config';
import { cwd } from '@/helpers';

export const execCommand = async (service: string, command: string[]) => {
    const currentCompose = config.get('currentCompose');
    const dir = await cwd();
    const { out } = await compose.exec(service, command, {
        cwd: dir,
        configAsString: currentCompose,
    });

    return out;
};

export const registerExec: CommandHandler = ({ program }) => {
    program.command('exec <service> <command...>')
        .action(async (service: string, command: string[]) => {
            const progress = ora(`Running "${command.join(' ')}" in "${service}"`).start();

            try {
                const out = await execCommand(service, command);

                progress.stop();
                console.log(out);
            } catch (e) {
                progress.stop();
                console.log(red(e.message));
            }
        });
};
