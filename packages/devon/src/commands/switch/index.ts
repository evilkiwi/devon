import type { IDockerComposeOptions } from 'docker-compose';
import compose from 'docker-compose';
import { green, red } from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { cwd, generateEnv, compileCompose, getServices, containerName } from '@/helpers';
import { run as down } from '@/commands/down';
import type { CommandHandler } from '@/types';
import { config } from '@/config';

export const run = async (chosen: string[], env: string) => {
    // Fetch the definition and service configs.
    const { definition, services } = await getServices();
    const dir = await cwd();

    console.log('');
    const running = ora('Compiling Docker Compose').start();

    // Down existing compose if any.
    await down();

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
    await generateEnv(env);

    // Up the compose file.
    running.text = 'Starting containers';

    await compose.upAll(composeConfig);

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
    console.log(green('Containers started successfully'));
};

export const register: CommandHandler = ({ program }) => {
    program.command('switch')
        .action(async () => {
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
                    message: 'Which Services are you working on?',
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
                    message: 'Which environment should the other Services use?',
                    choices: definition.environments.map(env => ({
                        name: env.name,
                        value: env.name,
                    })),
                }]);

                await run(answers.services, answers.environment);
            } catch (e) {
                // console.error(red((e as Error).message));
                console.error(e);
            }
        });
};
