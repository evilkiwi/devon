import type { IDockerComposeOptions } from 'docker-compose';
import compose from 'docker-compose';
import inquirer from 'inquirer';
import consola from 'consola';
import ora from 'ora';
import { cwd, generateEnv, compileCompose, getServices, containerName } from '../../helpers';
import type { CommandHandler } from '../../types';
import { run as down } from '../down';
import { config } from '../../config';

export const run = async (chosen: string[], env: string, verbose = false) => {
    const log = (msg: string) => {
        if (verbose) {
            consola.log(msg);
        }
    };

    // Fetch the definition and service configs.
    const { definition, services } = await getServices();
    const dir = await cwd();

    consola.log('');
    const running = ora('compiling docker-compose yaml').start();

    if (verbose) {
        running.stop();
    }

    // Down existing compose if any.
    log('downing previous containers (if any)');
    await down();
    log('containers downed');

    // Compile the docker-compose config.
    const configs = [
        ...chosen,
        ...Object.keys(services).filter(name => {
            return services[name].definition.force === true;
        }),
    ].reduce<any>((config, name) => {
        return {
            ...config,
            [name]: {
                ...services[name].config,
                compose: services[name].config.compose ? {
                    ...services[name].config.compose,
                    container_name: containerName(definition.project, name),
                } : undefined,
            },
        };
    }, {});

    // Compile docker compose command config.
    const compiledConfig = await compileCompose(configs);

    log('compiled docker-compose:');
    log(compiledConfig);

    const composeConfig: IDockerComposeOptions = {
        configAsString: compiledConfig,
        cwd: dir,
        log: false,
        env: {
            ...process.env,
            COMPOSE_PROJECT_NAME: definition.project,
        },
    };

    // Trigger .env changes.
    log('generating new .env files');
    await generateEnv(env);
    log('.env files generated successfully');

    // Up the compose file.
    running.text = 'starting containers';
    log('starting containers');
    const result = await compose.upAll(composeConfig);

    if (result.err) {
        log(`failed to start containers: ${result.err}`);
    } else {
        log(`containers started successfully: ${result.out}`);
    }

    config.set('currentCompose', {
        project: definition.project,
        compose: compiledConfig,
    });

    // Set the current services for this project.
    const current = config.get('currentServices');
    const exists = current.find(item => item.project === definition.project) !== undefined;

    if (exists) {
        config.set('currentServices', current.map(item => {
            if (item.project === definition.project) {
                item.services = chosen;
            }

            return item;
        }));
    } else {
        config.set('currentServices', [
            ...current,
            {
                project: definition.project,
                services: chosen,
            },
        ]);
    }

    // Done!
    running.stop();
    consola.success('containers started');
};

export const register: CommandHandler = ({ program }) => {
    program.command('switch')
        .option('-V, --verbose', 'output debug info and steps')
        .action(async (opts: { verbose?: boolean }) => {
            try {
                const { definition, services } = await getServices();
                const existingServices = config.get('currentServices').find(item => item.project === definition.project);

                // Ask which services to use.
                const answers = await inquirer.prompt<{
                    services: string[];
                    environment: string;
                }>([{
                    type: 'checkbox',
                    name: 'services',
                    message: 'which Services are you working on?',
                    choices: Object.keys(services).filter(key => {
                        return services[key].definition.force !== true;
                    }).map(key => ({
                        name: key,
                        value: key,
                        checked: (existingServices?.services.indexOf(key) ?? -1) !== -1,
                    })),
                }, {
                    type: 'list',
                    name: 'environment',
                    message: 'which environment should the other services use?',
                    choices: definition.environments.map(env => ({
                        name: env.name,
                        value: env.name,
                    })),
                }]);

                await run(answers.services, answers.environment, opts.verbose);
            } catch (e) {
                consola.error(e as Error);
            }
        });
};
