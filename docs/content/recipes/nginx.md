---
title: NGINX Recipe
head:
  - - meta
    - name: description
      content: Add NGINX Reverse Proxy to your local dev environment using Devon
  - - meta
    - name: description
      content: Add NGINX Reverse Proxy to your local dev environment using Devon
---

# NGINX Recipe

## Configs

If you chose not to add an NGINX Reverse Proxy to your monorepo during the `devon init` command, you can add it using the following recipe:

`.devon/proxy/.devconfig.ts`

```typescript
import type { ServiceConfig } from '@evilkiwi/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'nginx:latest',
        ports: ['80:80', '443:443'],
        volumes: [
            './.devon/proxy/sites:/etc/nginx/conf.d', // Map a `sites` directory to the nginx config
            './.devon/proxy/certs:/etc/ssl', // Only needed if you need the Devon local SSL
        ],
        restart: 'always',
    },
};
```

`.devon.ts`

```typescript
import type { DefinitionFile } from '@evilkiwi/devon';

export const config: DefinitionFile = {
    ...
    services: [
        ...
        {
            name: 'proxy',
            path: '.devon/proxy',
            force: true, // Makes sure NGINX _always_ boots
        },
    ],
    ...
};
```

::: tip
Make sure to re-run the `devon switch` command to bring the new container up!
:::

## Site Configurations

Looking at the Docker Compose volumes in the service config, we mount a `.devon/proxy/sites` folder to the container. This directory is where you can add all of your NGINX site config files.

For example, to forward to a [Vite](https://vitejs.dev/) dev server:

`.devon/proxy/sites/example.conf`

```nginx
server {
    listen 443 ssl; # Switch this to `listen 80;` if not using SSL
    server_name local.example.com;

    # Only needed if using the Devon-managed SSL
    ssl_certificate /etc/ssl/local.example.com.pem;
    ssl_certificate_key /etc/ssl/local.example.com-key.pem;

    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Host $host;
        proxy_pass http://host.docker.internal:3000; # Points to `localhost:3000`
        proxy_redirect off;
        proxy_http_version 1.1;
	    proxy_set_header Upgrade $http_upgrade;
	    proxy_set_header Connection "Upgrade";
    }
}

# Remove this server if not using SSL
server {
    listen 80;
    server_name local.example.com;

    return 301 https://$host$request_uri;
}
```

::: tip
Make sure to re-run the `devon switch` command any time you change these configs to restart NGINX
:::
