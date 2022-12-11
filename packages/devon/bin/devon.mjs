#!/usr/bin/env node
import { createRequire } from 'node:module';
import '@esbuild-kit/cjs-loader';

global.require = createRequire(import.meta.url);

import('../build/index.mjs').then(r => (r.default || r).main());
