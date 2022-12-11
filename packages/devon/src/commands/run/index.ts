import { spawn } from 'child_process';
import { CliUx } from '@oclif/core';
import consola from 'consola';
import type { Command, CommandHandler } from '../../types';
import { getServices } from '../../helpers';

export const run = async (scripts?: string[]) => {
  const { definition } = await getServices();
  const available = definition.scripts ?? {};

  if (!Object.keys(available).length) {
    throw new Error('there are no configured scripts');
  }

  if (!scripts) {
    CliUx.ux.table(
      Object.keys(available).reduce<Record<string, unknown>[]>((arr, name) => {
        return [ ...arr, { ...available[name], name } ];
      }, []),
      {
        name: {},
        desc: { header: 'description' },
      },
    );

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
    throw new Error('no commands by these name(s) exist');
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
          p.stdout.on('data', data => consola.log(data));
          p.stderr.on('data', data => consola.error(data));
          p.on('error', e => consola.error(e));
          p.on('close', code => consola.info(`Exited (${code})`));
        });
      } catch (e) {
        consola.error(e as Error);
      }
    });
};
