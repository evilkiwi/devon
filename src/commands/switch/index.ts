import type { IDockerComposeOptions } from 'docker-compose';
import compose from 'docker-compose';
import { green, red } from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { cwd, generateEnv, compileCompose, getServices, containerName } from '@/helpers';
import type { CommandHandler } from '@/types';
import { downCommand } from '@/commands/down';
import { config } from '@/config';

export const switchCommand = async (chosen: string[], env: string) => {
    // Fetch the definition and service configs.
    const { definition, services } = await getServices();
    const dir = await cwd();

    console.log('');
    const running = ora('Compiling Docker Compose').start();

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
        cwd: dir,
        configAsString: compiledConfig,
        log: false,
    };

    // Down existing compose if any.
    await downCommand();

    // Trigger .env changes.
    await generateEnv(env);

    // Up the compose file.
    running.text = 'Starting containers';

    await compose.upAll(composeConfig);
    config.set('currentCompose', composeConfig.configAsString);
    config.set('currentServices', chosen);

    // Done!
    running.stop();
    console.log(green('Containers started successfully'));
};

export const registerSwitch: CommandHandler = ({ program }) => {
    program.command('switch')
        .action(async () => {
            try {
                const { definition, services } = await getServices();
                const existingServices = config.get('currentServices');

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
                        checked: existingServices.indexOf(key) !== -1,
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

                await switchCommand(answers.services, answers.environment);
            } catch (e) {
                console.error(red(e.message));
            }
        });
};
