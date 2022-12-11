import { execFileSync } from 'child_process';
import consola from 'consola';
import type { CommandHandler } from '../../types';
import { containerName } from '../../helpers';
import { config } from '../../config';

export const run = async (service: string, shell = 'bash') => {
  const currentCompose = config.get('currentCompose');

  if (!currentCompose) {
    throw new Error('no containers running - run `devon switch`');
  }

  execFileSync('docker', ['exec', '-it', containerName(currentCompose.project, service), shell], {
    stdio: 'inherit',
  });
};

export const register: CommandHandler = ({ program }) => {
  program.command('interact <service>')
    .option('-s, --shell <shell>', 'override the default shell (bash)')
    .action(async (service: string, opts: { shell?: string }) => {
      try {
        await run(service, opts.shell);
      } catch (e) {
        consola.error(e as Error);
      }
    });
};
