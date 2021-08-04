import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import { readJsonSync } from 'fs-extra';
import { builtinModules } from 'module';
import json from '@rollup/plugin-json';
import { resolve as resolveFs, join } from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const pkg = readJsonSync(join(__dirname, 'package.json'));

export default {
    input: 'src/index.ts',
    external: [
        ...Object.keys(pkg.dependencies),
        ...builtinModules,
    ],
    output: [{
        file: pkg.main,
        format: 'cjs',
        sourcemap: !isProduction,
        banner: '#!/usr/bin/env node\n',
    }],
    plugins: [
        typescript({
            typescript: require('typescript'),
        }),
        alias({
            entries: [
                { find: /^@\/(.*)/, replacement: `${resolveFs(__dirname, 'src')}/$1` },
            ],
        }),
        json(),
        resolve(),
        commonjs(),
        (isProduction && terser()),
    ],
};
