import compose from 'docker-compose';
import { red } from 'chalk';
import ora from 'ora';
import type { CommandHandler } from '@/types';
import { cwd } from '@/helpers';

export const execCommand: CommandHandler = ({ config, program }) => {
    program.command('exec <service> <command...>')
        .action(async (service: string, command: string[]) => {
            const currentCompose = config.get('currentCompose');
            const dir = await cwd();

            const progress = ora(`Running "${command.join(' ')}" in "${service}"`).start();

            try {
                const { out } = await compose.exec(service, command, {
                    cwd: dir,
                    configAsString: currentCompose,
                });

                progress.stop();
                console.log(out);
            } catch (e) {
                progress.stop();
                console.log(red(e));
            }
        });
};
