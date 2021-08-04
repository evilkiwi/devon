import { spawn } from 'child_process';
import { red, yellow } from 'chalk';
import ux from 'cli-ux';
import type { Command, CommandHandler, Script } from '@/types';
import { getServices } from '@/helpers';

export const runCommand: CommandHandler = ({ program }) => {
    program.command('run [scripts...]')
        .action(async (scripts?: string[]) => {
            const { definition } = await getServices();
            const available = definition.scripts ?? {};

            if (!Object.keys(available).length) {
                console.log(yellow('There are no configured scripts'));
                return;
            }

            if (!scripts) {
                ux.table(Object.keys(available).reduce<Script[]>((arr, name) => {
                    return [
                        ...arr,
                        { ...available[name], name },
                    ];
                }, []), {
                    name: {},
                    desc: {
                        header: 'Description',
                    },
                });
                return;
            }

            const commands = scripts.reduce<Command[]>((arr, name) => {
                if (!available[name]) {
                    return arr;
                }

                return [
                    ...arr,
                    ...available[name].commands,
                ];
            }, []);

            if (!commands.length) {
                console.log(yellow('No commands by these name(s) exist'));
                return;
            }

            commands.forEach(cmd => {
                const run = spawn(cmd.command, cmd.args);
                const prefix = `[${cmd.name}]`;

                run.stdout.on('data', data => {
                    console.log(`${prefix} ${data}`);
                });
                run.stderr.on('data', data => {
                    console.error(red(`${prefix} ${data}`));
                });

                run.on('error', err => {
                    console.error(red(`${prefix} ${err}`));
                });
                run.on('close', code => {
                    console.log(yellow(`${prefix} Exited (${code})`));
                });
            });
        });
};
