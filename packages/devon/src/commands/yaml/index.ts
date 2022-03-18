import inquirer from 'inquirer';
import consola from 'consola';
import ora from 'ora';
import { compileCompose, getServices, containerName } from '../../helpers';
import type { CommandHandler } from '../../types';
import { run as down } from '../down';
import { config } from '../../config';

export const run = async (chosen: string[]) => {
    // Fetch the definition and service configs.
    const { definition, services } = await getServices();

    consola.log('');
    const running = ora('compiling docker-compose yaml').start();

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
    const config = await compileCompose(configs);
    consola.log(config);

    // Done!
    running.stop();
    consola.success('yaml printed');
};

export const register: CommandHandler = ({ program }) => {
    program.command('yaml')
        .action(async () => {
            try {
                const { definition, services } = await getServices();
                const existingServices = config.get('currentServices').find(item => item.project === definition.project);

                // Ask which services to use.
                const answers = await inquirer.prompt<{ services: string[] }>([{
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
                }]);

                await run(answers.services);
            } catch (e) {
                consola.error(e as Error);
            }
        });
};
