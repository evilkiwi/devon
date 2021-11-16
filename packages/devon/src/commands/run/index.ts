import { spawn } from 'child_process';
import { red, yellow } from 'chalk';
import ux from 'cli-ux';
import type { Command, CommandHandler, Script } from '@/types';
import { getServices } from '@/helpers';

export const run = async (scripts?: string[]) => {
    const { definition } = await getServices();
    const available = definition.scripts ?? {};

    if (!Object.keys(available).length) {
        throw new Error('There are no configured scripts');
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
        return [];
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
        throw new Error('No commands by these name(s) exist');
    }

    return commands.map(cmd => {
        return spawn(cmd.command, cmd.args);
    });
};

export const register: CommandHandler = ({ program }) => {
    program.command('run [scripts...]')
        .action(async (scripts?: string[]) => {
            try {
                const processes = await run(scripts);

                processes.forEach(p => {
                    p.stdout.on('data', data => {
                        console.log(`${data}`);
                    });
                    p.stderr.on('data', data => {
                        console.error(red(`${data}`));
                    });
                    p.on('error', err => {
                        console.error(red(`${err}`));
                    });
                    p.on('close', code => {
                        console.log(yellow(`Exited (${code})`));
                    });
                });
            } catch (e) {
                console.log(red((e as Error).message));
            }
        });
};
