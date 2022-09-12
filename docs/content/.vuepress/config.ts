import { defineUserConfig, defaultTheme } from 'vuepress';

export default defineUserConfig({
    base: '/devon/',
    lang: 'en-US',
    title: 'Devon',
    description: 'Docker-based Monorepo Local Development CLI',
    locales: {
        '/': {
            lang: 'en-US',
        },
    },
    theme: defaultTheme({
        home: '/',
        logo: 'https://vuejs.org/images/logo.png',
        repo: 'evilkiwi/devon',
        docsDir: 'docs/content',
        docsBranch: 'master',
        locales: {
            '/': {
                selectLanguageName: 'English',
            },
        },
        sidebar: [{
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
    }),
});
