import type { IDockerComposeOptions } from 'docker-compose';
import compose from 'docker-compose';
import inquirer from 'inquirer';
import { green } from 'chalk';
import ora from 'ora';
import { cwd, generateEnv, compileCompose, getServices, containerName } from '@/helpers';
import type { CommandHandler } from '@/types';

export const switchCommand: CommandHandler = ({ config, program }) => {
    program.command('switch')
        .action(async () => {
            // Fetch the definition and service configs.
            const { definition, services } = await getServices();
            const existingServices = config.get('currentServices');
            const dir = await cwd();

            // Ask which services to use.
            const chosenServices = await inquirer.prompt<{
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

            console.log('');
            const running = ora('Compiling Docker Compose').start();

            // Compile the docker-compose config.
            const configs = [
                ...chosenServices.services,
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
            const composeConfig: IDockerComposeOptions = {
                cwd: dir,
                configAsString: compileCompose(configs),
                log: false,
            };

            // Down existing compose if any.
            const existingCompose = config.get('currentCompose');

            if (existingCompose.length) {
                running.text = 'Pulling down previous containers';

                try {
                    await compose.down({
                        ...composeConfig,
                        configAsString: existingCompose,
                    });
                } catch (e) {
                    //
                }

                config.set('current', '');
            }

            // Trigger .env changes.
            await generateEnv(chosenServices.environment);

            // Up the compose file.
            running.text = 'Starting containers';

            try {
                await compose.upAll(composeConfig);
                config.set('currentCompose', composeConfig.configAsString);
                config.set('currentServices', chosenServices.services);
            } catch (e) {
                //
            }

            // Done!
            running.stop();
            console.log(green('Containers started successfully'));
        });
};
