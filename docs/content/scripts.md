---
title: Multi-command Scripts
head:
  - - meta
    - name: description
      content: Multi-command Scripts allow you to run multiple commands at a time
  - - meta
    - name: description
      content: Multi-command Scripts allow you to run multiple commands at a time
---

# Multi-command Scripts

Devon offers the ability to run commands comprised of other CLI commands. This is incredibly useful for monorepos with a lot of services.

For example, instead of running `yarn app dev`, `yarn api dev`, `yarn ui dev`..., you can configure all 3 as a multi-command script with Devon, enabling you to just run `devon run frontends`.

## Configuring

In your top-level definition file (`.devon.ts`), you can add a `scripts` object. This is where all of your Scripts will be registered. They key in this object is the same key used in the `devon run` command.

For example, to define a command that runs all frontend dev scripts:

```typescript
import type { DefinitionFile } from '@evilkiwi/devon';

export const config: DefinitionFile = {
    ...
    scripts: {
        frontends: {
            desc: 'Run all required App Frontends',
            commands: [{
                name: 'app',
                command: 'yarn',
                args: ['app', 'dev'],
            }, {
                name: 'ui',
                command: 'yarn',
                args: ['ui', 'dev'],
            }],
        },
    },
    ...
};
```

## Using

To use the defined Scripts, call the `devon run` command. You can supply any number of keys to the command and it will run all relevant commands. For example, `devon run api frontends` runs the `api` and `frontends` Devon scripts.
