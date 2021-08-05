import { Command } from 'commander';
import { register } from 'ts-node';
import pkg from '../package.json';
import * as Commands from './commands';
import { config } from './config';

// Register ts-node to allow `require` for `.ts` files.
register({
    emit: false,
    pretty: true,
    skipProject: true,
    transpileOnly: true,
});

// Create the root CLI program.
const program = new Command();

program.version(pkg.version)
    .description(pkg.description)
    .showHelpAfterError('(add --help for additional information)');

// Register the individual commands.
Object.keys(Commands).forEach(command => {
    if (command.indexOf('register') === -1) {
        return;
    }

    (Commands as any)[command]({
        program,
        config,
    });
});

program.parseAsync(process.argv);

export {
    runCommand,
    execCommand,
    downCommand,
    switchCommand,
    installCommand,
} from './commands';

export * from './types';
