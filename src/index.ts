import { Command } from 'commander';
import { register } from 'ts-node';
import pkg from '../package.json';
import * as Commands from './commands';
import { config } from './config';
import type { CommandHandler } from './types';

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
Object.values<CommandHandler>(Commands).forEach(command => command({
    program,
    config,
}));

program.parseAsync(process.argv);

export * from './types';
