import { exec as e } from 'child_process';
import handlebars from 'handlebars';
import { join, sep } from 'path';
import { promisify } from 'util';
import inquirer from 'inquirer';
import consola from 'consola';
import fs from 'fs-extra';
import ora from 'ora';
import { cwd, glob, generateCertificates, generateAuthority } from '../../helpers';
import type { CommandHandler } from '../../types';
import * as templates from '../../templates';

const exec = promisify(e);

// All files we recognize inside top-level folders as potentially microservice definitions.
const recognizedFiles = [
    '.env',
    'package.json',
    'composer.json',
    'serverless.yml',
    'serverless.yaml',
];

export const register: CommandHandler = ({ config, program }) => {
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
            const existing = await fs.pathExists(definitionPath);

            if (existing) {
                consola.warn('devon is already initialized in working directory');
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
                ssl: boolean;
                bootstrap: string[];
                db: 'mysql8'|'mysql5'|null;
                redis: boolean;
                proxy?: boolean;
                domains?: string;
            }>([{
                type: 'input',
                name: 'project',
                message: 'project name',
                default: projectName,
                validate: (name: string) => {
                    if (!name.length) {
                        return 'project name is required';
                    }

                    return true;
                },
            }, {
                type: 'list',
                name: 'manager',
                message: 'which package manager do you use?',
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
                message: 'bootstrap existing services?',
                choices: services.map(name => ({
                    name,
                    value: name,
                })),
            }, {
                type: 'list',
                name: 'db',
                message: 'add a database?',
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
                message: 'add redis?',
            }, {
                type: 'confirm',
                name: 'proxy',
                message: 'add an nginx proxy?',
            }, {
                type: 'confirm',
                name: 'ssl',
                message: 'automate local ssl? (you must install mkcert, see docs)',
                when: ({ proxy }) => proxy,
            }, {
                type: 'input',
                name: 'domains',
                message: 'domains for ssl certificate (separate with space)',
                when: ({ ssl }) => ssl,
            }]);

            consola.log('');
            const init = ora('setting up').start();

            try {
                // Ensure the data folders exist and are empty.
                await fs.emptyDir(dataPath);
                await fs.emptyDir(join(dataPath, dataFolder));

                // Create the gitignore for mounted filesystem data.
                await fs.outputFile(join(dataPath, '.gitignore'), dataFolder);

                // Attempt to install as a global dev dependency.
                try {
                    let command = '';

                    switch (answers.manager) {
                        case 'yarn': command = 'yarn add @evilkiwi/devon --dev -W'; break;
                        case 'npm': command = 'npm install --dev @evilkiwi/devon'; break;
                    }

                    if (command.length) {
                        init.text = 'installing global dev-dependency';
                        await exec(command, {
                            cwd: dir,
                        });
                    }
                } catch (e) {
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

                init.text = 'compiling service configs';

                await chosen.reduce(async (promise, service) => {
                    const cfg = handlebars.compile((templates as any)[service]);
                    const chosenPath = join(dataPath, service);

                    await fs.emptyDir(chosenPath);
                    await fs.outputFile(join(chosenPath, serviceFilename), cfg(input));
                }, Promise.resolve());

                // Output config files to each service.
                const serviceConfig = handlebars.compile(templates.serviceFile);
                await answers.bootstrap.reduce(async (promise, service) => {
                    await promise;

                    const conf = services.find(item => item === service);

                    if (conf) {
                        const servicePath = join(path, conf, serviceFilename);
                        const exists = await fs.pathExists(servicePath);

                        if (!exists) {
                            await fs.outputFile(join(path, conf, serviceFilename), serviceConfig(input));
                        }
                    }
                }, Promise.resolve());

                // If they enabled the proxy, create the additional files for that.
                let proxyDomains: string[] = [];

                if (answers.proxy) {
                    const proxyPath = join(dataPath, 'proxy');

                    init.text = 'generating proxy certificates';

                    await fs.emptyDir(join(proxyPath, 'sites'));
                    await fs.emptyDir(join(proxyPath, 'certs'));

                    await fs.outputFile(join(proxyPath, 'sites', 'app.conf'), templates.proxyExample);

                    if (answers.ssl) {
                        // Generate and Install the CA.
                        await generateAuthority(proxyPath);

                        // Generate the usable SSL Certificates.
                        proxyDomains.push(...(answers.domains ?? '').split(' '));

                        if (proxyDomains.length && proxyDomains[0].length) {
                            await generateCertificates(proxyPath, proxyDomains);
                        }
                    }
                }

                // Save the definition file.
                const definition = handlebars.compile(templates.definitionFile);

                await fs.outputFile(definitionPath, definition({
                    ...input,
                    proxyDomains,
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
                consola.success('finished setting up!');
                consola.log('');
                consola.log(`definition file saved to ${definitionPath}`);
                consola.log('');
                consola.log('run `devon switch` to start your new environment');
            } catch (e) {
                init.stop();
                consola.error(`could not set-up devon: ${e}`);
            }
        });
};
