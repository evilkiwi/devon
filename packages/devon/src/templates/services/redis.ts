export const redis = `import type { ServiceConfig } from '@evilkiwi/devon';

export const config: ServiceConfig = {
  compose: {
    image: 'redis',
    ports: ['63791:6379'],
    volumes: [
      './{{dir}}/{{dataFolder}}/redis:/data',
    ],
    restart: 'always',
  },
};
`;
