import { Command } from 'commander';
import { register } from 'ts-node';
import consola from 'consola';
import pkg from '../package.json';
import * as commands from './commands';
import { config } from './config';
import type { CommandPayload } from './types';

export function main() {
    // Register ts-node to allow `require` for `.ts` files.
    register({
        emit: false,
        pretty: true,
        skipProject: true,
        transpileOnly: true,
    });

    // Set-up Consola.
    process.on('unhandledRejection', err => consola.error('[unhandledRejection]', err));
    process.on('uncaughtException', err => consola.error('[uncaughtException]', err));
    consola.wrapConsole();

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

    program.parseAsync(process.argv).catch((e: Error) => {
        consola.error(e);
        process.exit(1);
    });
}

export * from './types';
