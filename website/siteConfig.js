const siteConfig = {
  title: 'Locust',
  tagline: 'Serverless web data discovery and extraction framework',
  url: 'https://achannarasappa.github.io',
  baseUrl: '/',
  projectName: 'locust-website',
  organizationName: 'achannarasappa',
  headerLinks: [
    { doc: 'getting_started', label: 'Docs' },
    { doc: 'api', label: 'API' },
    { doc: 'cli', label: 'CLI' },
    { href: 'https://github.com/achannarasappa/locust', label: 'GitHub' },
  ],
  headerIcon: 'img/locust-logo-white.svg',
  footerIcon: 'img/locust-icon-inverse.svg',
  favicon: 'img/favicon.ico',
  colors: {
    primaryColor: '#2B2A2E',
    secondaryColor: '#dfa82a',
  }, copyright: `Copyright © ${new Date().getFullYear()} Ani Channarasappa`,
  highlight: {
    theme: 'dark',
  },
  onPageNav: 'separate',
  cleanUrl: true,
  enableUpdateBy: true,
  enableUpdateTime: true,
  markdownPlugins: [
    require('remarkable-admonitions')({ icon: 'svg-inline' })
  ],
  cname: 'locust.dev',
  scripts: [
    'https://locust-static.s3.us-east-1.amazonaws.com/heap.js'
  ]
};

module.exports = siteConfig;
