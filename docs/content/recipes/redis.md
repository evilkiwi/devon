---
title: Redis Recipe
head:
  - - meta
    - name: description
      content: Add Redis to your local dev environment using Devon
  - - meta
    - name: description
      content: Add Redis to your local dev environment using Devon
---

# Redis Recipe

## Configs

If you chose not to add Redis to your monorepo during the `devon init` command, you can add it using the following recipe:

`.devon/redis/.devconfig.ts`

```typescript
import type { ServiceConfig } from '@tnotifier/devon';

export const config: ServiceConfig = {
    compose: {
        image: 'redis',
        ports: ['62098:6379'],
        volumes: [
            './.devon/.data/redis:/data',
        ],
        restart: 'always',
    },
};
```

`.devon.ts`

```typescript
import type { DefinitionFile } from '@tnotifier/devon';

export const config: DefinitionFile = {
    ...
    services: [
        ...
        {
            name: 'redis',
            path: '.devon/redis',
            force: true, // Makes sure Redis _always_ boots
        },
    ],
    ...
};
```

::: tip
Make sure to re-run the `devon switch` command to bring the new container up!
:::
