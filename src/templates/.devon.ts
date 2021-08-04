export const definitionFile = `import type { DefinitionFile } from '@casthub/devon';

export const config: DefinitionFile = {
    project: '{{project}}',
    services: [{{#each services}}{{#if @index}}, {{/if}}{
        name: '{{this.name}}',{{#if this.path}}
        path: '{{this.path}}',{{/if}}{{#if this.force}}
        force: {{this.force}},{{/if}}
    }{{/each}}],
    environments: [{
        name: 'local',
        desc: 'Use your local machine',
    }],
};
`;
