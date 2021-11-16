---
title: Getting Started
head:
  - - meta
    - name: description
      content: Get started using the Devon CLI for Docker
  - - meta
    - name: description
      content: Get started using the Devon CLI for Docker
---

# Getting Started

## Installing

Devon is distributed as a NodeJS-based CLI through npm. You can install it locally, but it's easier to work with when installed globally:

```bash
yarn global add @casthub/devon

# or

npm install -g @casthub/devon
```

::: warning
Devon is **not meant for production environments** - it exists purely to make local development easier.
:::

## Requirements

Devon has a couple requirements for running different aspects of the CLI. Whether you install the optional ones or not is up to you.

- Docker **[required]** - Devon uses Docker to run the virtualized environment. [Download Docker here](https://www.docker.com/products/docker-desktop).
- mkcert - If you want to use the SSL Automation provided by Devon, you need to install this. [Installation instructions here](https://github.com/FiloSottile/mkcert#installation).

## Initializing a Monorepo

Devon is built to be added to existing Monorepos - so make sure you set up yours via Yarn workspaces/Lerna/etc. before initializing Devon.

Using the `devon init` command at the root-level of your Monorepo, you'll be taken through a list of options to bootstrap your new Devon set-up.

This includes things like:

- Naming your Project
- Choosing existing services to bootstrap
- Optionally add some additional services, such as MySQL, Redis or an NGINX Proxy

Once you're done initializing Devon in your monorepo, you're good to go!

## Starting your Environment

The one command you'll likely use 90% of the time is `devon switch`. This command will let you pick which services you'd like to work on, which environment you want them to use, and then compile the relevant Docker Compose and start the containers.

At this point you're all set - you can use `devon help` for a list of commands and their usage, or check out our predefined recipes.
