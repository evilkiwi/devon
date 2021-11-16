import { Command } from 'commander';
import { register } from 'ts-node';
import pkg from '../package.json';
import * as commands from './commands';
import { config } from './config';
import type { CommandPayload } from './types';

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
const payload: CommandPayload = {
    program,
    config,
};

Object.values(commands).forEach(command => {
    if (command.register !== undefined) {
        command.register(payload);
    }
});

program.parseAsync(process.argv);

export * from './types';
