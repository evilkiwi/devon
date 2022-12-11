#!/usr/bin/env tsx
import('../build/index.mjs').then(r => (r.default || r).main());
