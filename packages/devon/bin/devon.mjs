#!/usr/bin/env node
import('../build/index.mjs').then(r => (r.default || r).main());
