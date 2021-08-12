module.exports = {
    lang: 'en-US',
    home: true,
    title: 'Devon',
    description: 'Docker-based Monorepo Local Development CLI',
    themeConfig: {
        repo: 'casthub/devon',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: 'Edit this page',
        lastUpdated: 'Last Updated',
        sidebar: {
            '/': [{
                text: 'Introduction',
                children: [{
                    text: 'Getting Started',
                    link: '/getting-started/',
                }, {
                    text: 'Configuration',
                    link: '/configuration/',
                }, {
                    text: 'Multi-command Scripts',
                    link: '/scripts/',
                }, {
                    text: 'SSL',
                    link: '/ssl/',
                }],
            }, {
                text: 'Recipes',
                children: [{
                    text: 'MySQL',
                    link: '/recipes/mysql/',
                }, {
                    text: 'Redis',
                    link: '/recipes/redis/',
                }, {
                    text: 'NGINX',
                    link: '/recipes/nginx/',
                }],
            }],
        },
    },
};
