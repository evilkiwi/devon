import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    outDir: 'build',
    declaration: true,
    clean: true,
    rollup: {
        inlineDependencies: true,
        cjsBridge: true,
        emitCJS: true,
    },
    entries: ['src/index'],
});
