import { emptyDir, pathExists, outputFile } from 'fs-extra';
import { green, red, yellow } from 'chalk';
import { exec as e } from 'child_process';
import handlebars from 'handlebars';
import { join, sep } from 'path';
import { promisify } from 'util';
import inquirer from 'inquirer';
import ora from 'ora';
import type { CommandHandler, Service } from '@/types';
import * as templates from '@/templates';
import { cwd, glob } from '@/helpers';

const exec = promisify(e);

// All files we recognize inside top-level folders as potentially microservice definitions.
const recognizedFiles = [
    '.env',
    'package.json',
    'composer.json',
    'serverless.yml',
    'serverless.yaml',
];

export const initCommand: CommandHandler = ({ config, program }) => {
    program.command('init')
        .action(async () => {
            const dir = config.get('dir');
            const filename = config.get('definitionFile');
            const serviceFilename = config.get('serviceFile');
            const dataFolder = config.get('dataFolder');
            const path = await cwd();
            const dataPath = join(path, dir);
            const definitionPath = join(path, filename);

            // Check this cwd isn't already initialized.
            const existing = await pathExists(definitionPath);

            if (existing) {
                console.log(yellow('devon is already initialized in working directory'));
                return;
            }

            // Figure out the default Project Name.
            const projectNameSplit = path.split(sep);
            const projectName = projectNameSplit[projectNameSplit.length - 1];

            // Otherwise, we can start to bootstrap.
            // First find all folders in cwd that _might_ be microservices.
            let services: string[] = (await glob(join(path, '*', `+(${recognizedFiles.join('|')})`), {
                dot: true,
            })).map(servicePath => {
                return servicePath.replace(`${path}${sep}`, '').split(sep)[0];
            });

            // Convert to a Set and back to easily remove duplicates.
            services = [...new Set(services)];

            // Then ask which, if any, should be bootstrapped, along with setting up some standard stuff.
            const answers = await inquirer.prompt<{
                project: string;
                manager: 'yarn'|'npm'|null;
                bootstrap: string[];
                db: 'mysql8'|'mysql5'|null;
                redis: boolean;
                proxy: boolean;
            }>([{
                type: 'input',
                name: 'project',
                message: 'Project Name',
                default: projectName,
                validate: (name: string) => {
                    if (!name.length) {
                        return 'Project Name is required';
                    }

                    return true;
                },
            }, {
                type: 'list',
                name: 'manager',
                message: 'Which Package Manager do you use?',
                choices: [{
                    name: 'Yarn',
                    value: 'yarn',
                }, {
                    name: 'NPM',
                    value: 'npm',
                }, {
                    name: 'None',
                    value: null,
                }],
            }, {
                type: 'checkbox',
                name: 'bootstrap',
                message: 'Bootstrap existing Services?',
                choices: services.map(name => ({
                    name,
                    value: name,
                })),
            }, {
                type: 'list',
                name: 'db',
                message: 'Add a Database?',
                choices: [{
                    name: 'None',
                    value: null,
                }, {
                    name: 'MySQL 8',
                    value: 'mysql8',
                }, {
                    name: 'MySQL 5.7',
                    value: 'mysql5',
                }],
            }, {
                type: 'confirm',
                name: 'redis',
                message: 'Add Redis?',
            }, {
                type: 'confirm',
                name: 'proxy',
                message: 'Add NGINX Reverse Proxy?',
            }]);

            console.log('');
            const init = ora('Setting up').start();

            try {
                // Ensure the data folders exist and are empty.
                await emptyDir(dataPath);
                await emptyDir(join(dataPath, dataFolder));

                // Create the gitignore for mounted filesystem data.
                await outputFile(join(dataPath, '.gitignore'), dataFolder);

                // Attempt to install as a global dev dependency.
                try {
                    let command = '';

                    switch (answers.manager) {
                        case 'yarn': command = 'yarn add @casthub/devon --dev -W'; break;
                        case 'npm': command = 'npm install --dev @casthub/devon'; break;
                    }

                    if (command.length) {
                        init.text = 'Installing global devdependency';
                        await exec(command, {
                            cwd: dir,
                        });
                    }
                } catch (e) {
                    console.log('xxx', e);
                    // Ignore.
                }

                // Create a common handlebars input.
                const input: any = {
                    dir,
                    dataFolder,
                    project: answers.project,
                };

                // Output config files for any chosen services.
                const chosen = [
                    ...(answers.redis ? ['redis'] : []),
                    ...(answers.proxy ? ['proxy'] : []),
                    ...(answers.db ? [answers.db] : []),
                ];

                init.text = 'Compiling service configs';

                await chosen.reduce(async (promise, service) => {
                    const cfg = handlebars.compile((templates as any)[service]);
                    const chosenPath = join(dataPath, service);

                    await emptyDir(chosenPath);
                    await outputFile(join(chosenPath, serviceFilename), cfg(input));
                }, Promise.resolve());

                // If they enabled the proxy, create the additional files for that.
                if (answers.proxy) {
                    const proxyPath = join(dataPath, 'proxy');

                    await emptyDir(join(proxyPath, 'sites'));
                    await emptyDir(join(proxyPath, 'certs'));

                    await outputFile(join(proxyPath, 'sites', 'app.conf'), templates.proxyExample);

                    // TODO: Initialize certs via mkcert
                }

                // Output config files to each service.
                const serviceConfig = handlebars.compile(templates.serviceFile);
                await answers.bootstrap.reduce(async (promise, service) => {
                    await promise;

                    const conf = services.find(item => item === service);

                    if (conf) {
                        const servicePath = join(path, conf, serviceFilename);
                        const exists = await pathExists(servicePath);

                        if (!exists) {
                            await outputFile(join(path, conf, serviceFilename), serviceConfig(input));
                        }
                    }
                }, Promise.resolve());

                // Save the definition file.
                const definition = handlebars.compile(templates.definitionFile);
                await outputFile(definitionPath, definition({
                    ...input,
                    services: [
                        ...answers.bootstrap.map(name => ({
                            name,
                        })),
                        ...chosen.map(name => ({
                            name,
                            path: join(dir, name),
                            force: true,
                        })),
                    ],
                }));

                init.stop();
                console.log(green('Finished setting up!'));
                console.log(yellow(`Definition file saved to ${definitionPath}`));
                console.log('');
                console.log(yellow('Run "devon switch" to start your new environment'));
            } catch (e) {
                init.stop();
                console.error(red('Could not set-up devon:', e.message));
            }
        });
};
