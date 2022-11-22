export const definitionFile = `import type { DefinitionFile } from '@evilkiwi/devon';

export const config: DefinitionFile = {
    project: '{{project}}',{{#if proxyDomains}}
    domains: [{{#each proxyDomains}}{{#if @index}}, {{/if}}'{{this}}'{{/each}}],{{/if}}
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
