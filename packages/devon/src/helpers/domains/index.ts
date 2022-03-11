import { chdir, cwd } from 'process';
import sudo from 'sudo-prompt';
import { join } from 'path';

export const generateAuthority = async (path: string) => new Promise<void>((resolve, reject) => {
    // Generate the Certificate Authority.
    sudo.exec('mkcert -install', {
        name: 'devon',
        env: { CAROOT: join(path, 'certs') },
    }, err => {
        if (err) {
            reject(err);
            return;
        }

        resolve();
    });
});

export const generateCertificates = async (path: string, domains: string[]) => {
    // Store current cwd and navigate to the certs folder.
    const ogCWD = cwd();
    chdir(join(path, 'certs'));

    // Generate certificates via mkcert.
    await new Promise<void>((resolve, reject) => {
        sudo.exec(`mkcert -key-file keys.pem -cert-file certs.pem ${domains.map(domain => `"${domain}"`).join(' ')}`, {
            name: 'devon',
            env: { CAROOT: join(path, 'certs') },
        }, err => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });

    // Move back to original cwd.
    chdir(ogCWD);
};
