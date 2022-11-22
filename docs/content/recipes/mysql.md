---
title: MySQL Recipe
head:
  - - meta
    - name: description
      content: Add MySQL 5/8 to your local dev environment using Devon
  - - meta
    - name: description
      content: Add MySQL 5/8 to your local dev environment using Devon
---

# MySQL Recipe

## Configs

If you chose not to add MySQL 5/8 to your monorepo during the `devon init` command, you can add it using the following recipe:

`.devon/mysql/.devconfig.ts`

```typescript
import type { ServiceConfig } from '@evilkiwi/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'mysql:8', // You can choose MySQL 5 or 8 here!
        ports: ['33068:3306'],
        environment: {
            // Change these details to ensure a
            // Database & User exist when the container starts
            MYSQL_ROOT_PASSWORD: 'evilkiwi',
            MYSQL_DATABASE: 'evilkiwi',
            MYSQL_USER: 'evilkiwi',
            MYSQL_PASSWORD: 'evilkiwi',
        },
        volumes: [
            './.devon/.data/mysql8:/var/lib/mysql',
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
            name: 'mysql',
            path: '.devon/mysql',
            force: true, // Makes sure MySQL _always_ boots
        },
    ],
    ...
};
```

::: tip
Make sure to re-run the `devon switch` command to bring the new container up!
:::
