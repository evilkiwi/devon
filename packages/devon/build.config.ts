import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  outDir: 'build',
  declaration: true,
  clean: true,
  rollup: {
    inlineDependencies: true,
    cjsBridge: false,
    emitCJS: false,
  },
  entries: ['src/index'],
});
