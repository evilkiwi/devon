#!/usr/bin/env -S node --loader tsx
import('../build/index.mjs').then(r => (r.default || r).main());
