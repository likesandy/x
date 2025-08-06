import os from 'node:os';
import { defineConfig } from 'dumi';
import path from 'path';

import rehypeAntd from './.dumi/rehypeAntd';
import remarkAntd from './.dumi/remarkAntd';
import { version } from './package.json';

export default defineConfig({
  plugins: ['dumi-plugin-color-chunk'],

  // For <Link prefetch />
  routePrefetch: {},
  manifest: {},

  // 配置webpack以启用sourcemap调试（当不使用Mako时）
  // chainWebpack(memo, { env }) {
  //   if (env === 'development') {
  //     // 启用最佳调试体验的sourcemap
  //     memo.devtool('eval-source-map');
  //   }
  //   return memo;
  // },

  // // Mako构建器配置
  // mako: ['Darwin', 'Linux'].includes(os.type()) ? {} : false,

  conventionRoutes: {
    // to avoid generate routes for .dumi/pages/index/components/xx
    exclude: [/index\/components\//],
  },
  ssr:
    process.env.NODE_ENV === 'production'
      ? {
          builder: 'mako',
        }
      : false,
  hash: true,
  mfsu: false,
  crossorigin: {},
  runtimePublicPath: {},
  outputPath: '_site',
  favicons: [
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original',
  ],
  resolve: {
    docDirs: [{ type: 'doc', dir: 'docs' }],
    atomDirs: [{ type: 'component', dir: 'components' }],
    codeBlockMode: 'passive',
  },
  locales: [
    { id: 'en-US', name: 'English', suffix: '' },
    { id: 'zh-CN', name: '中文', suffix: '-cn' },
  ],
  define: {
    antdReproduceVersion: version,
    // Environment variables for API configuration
    'process.env.REACT_APP_API_BASE_URL': process.env.REACT_APP_API_BASE_URL,
    'process.env.REACT_APP_API_PATH': process.env.REACT_APP_API_PATH,
    'process.env.REACT_APP_MODEL': process.env.REACT_APP_MODEL,
    'process.env.REACT_APP_API_KEY': process.env.REACT_APP_API_KEY,
  },
  externals: {
    // optimize build of GPT-Vis
    'mapbox-gl': 'mapboxgl',
    'maplibre-gl': 'maplibregl',
  },
  alias: {
    '@ant-design/x/lib': path.join(__dirname, 'components'),
    '@ant-design/x/es': path.join(__dirname, 'components'),
    '@ant-design/x': path.join(__dirname, 'components'),
    // https://github.com/ant-design/ant-design/issues/46628
    '@ant-design/icons$': '@ant-design/icons/lib',
  },
  extraRehypePlugins: [rehypeAntd],
  extraRemarkPlugins: [remarkAntd],
  metas: [
    { name: 'theme-color', content: '#1677ff' },
    { name: 'build-time', content: Date.now().toString() },
    // https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables
    { name: 'build-hash', content: process.env.GITHUB_SHA ?? 'unknown' },
  ],
  analytics: {
    ga_v2: 'G-5CDH4LN3Z8',
  },
  transformRuntime: {
    absoluteRuntime: process.cwd(),
  },
  analyze:
    process.env.NODE_ENV === 'production'
      ? false
      : {
          analyzerPort: 'auto',
        },
  links: [
    {
      rel: 'prefetch',
      as: 'font',
      href: '//at.alicdn.com/t/webfont_6e11e43nfj.woff2',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    {
      rel: 'prefetch',
      as: 'font',
      href: '//at.alicdn.com/t/webfont_6e11e43nfj.woff',
      type: 'font/woff',
      crossorigin: 'anonymous',
    },
    {
      rel: 'prefetch',
      as: 'font',
      href: '//at.alicdn.com/t/webfont_6e11e43nfj.ttf',
      type: 'font/ttf',
      crossorigin: 'anonymous',
    },
    {
      rel: 'prefetch',
      as: 'font',
      href: '//at.alicdn.com/t/webfont_exesdog9toj.woff2',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    {
      rel: 'prefetch',
      as: 'font',
      href: '//at.alicdn.com/t/webfont_exesdog9toj.woff',
      type: 'font/woff',
      crossorigin: 'anonymous',
    },
    {
      rel: 'prefetch',
      as: 'font',
      href: '//at.alicdn.com/t/webfont_exesdog9toj.ttf',
      type: 'font/ttf',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '//at.alicdn.com/wf/webfont/exMpJIukiCms/Gsw2PSKrftc1yNWMNlXgw.woff2',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
    {
      rel: 'preload',
      as: 'font',
      href: '//at.alicdn.com/wf/webfont/exMpJIukiCms/vtu73by4O2gEBcvBuLgeu.woff',
      type: 'font/woff2',
      crossorigin: 'anonymous',
    },
  ],
  headScripts: [
    `
    (function () {
      function isLocalStorageNameSupported() {
        const testKey = 'test';
        const storage = window.localStorage;
        try {
          storage.setItem(testKey, '1');
          storage.removeItem(testKey);
          return true;
        } catch (error) {
          return false;
        }
      }
      // 优先级提高到所有静态资源的前面，语言不对，加载其他静态资源没意义
      const pathname = location.pathname;

      function isZhCN(pathname) {
        return /-cn\\/?$/.test(pathname);
      }
      function getLocalizedPathname(path, zhCN) {
        const pathname = path.indexOf('/') === 0 ? path : '/' + path;
        if (!zhCN) {
          // to enUS
          return /\\/?index(-cn)?/.test(pathname) ? '/' : pathname.replace('-cn', '');
        } else if (pathname === '/') {
          return '/index-cn';
        } else if (pathname.indexOf('/') === pathname.length - 1) {
          return pathname.replace(/\\/$/, '-cn/');
        }
        return pathname + '-cn';
      }

      // 兼容旧的 URL， \`?locale=...\`
      const queryString = location.search;
      if (queryString) {
        const isZhCNConfig = queryString.indexOf('zh-CN') > -1;
        if (isZhCNConfig && !isZhCN(pathname)) {
          location.pathname = getLocalizedPathname(pathname, isZhCNConfig);
        }
      }

      // 首页无视链接里面的语言设置 https://github.com/ant-design/ant-design/issues/4552
      if (isLocalStorageNameSupported() && (pathname === '/' || pathname === '/index-cn')) {
        const lang =
          (window.localStorage && localStorage.getItem('locale')) ||
          ((navigator.language || navigator.browserLanguage).toLowerCase() === 'zh-cn'
            ? 'zh-CN'
            : 'en-US');
        // safari is 'zh-cn', while other browser is 'zh-CN';
        if ((lang === 'zh-CN') !== isZhCN(pathname)) {
          location.pathname = getLocalizedPathname(pathname, lang === 'zh-CN');
        }
      }
      document.documentElement.className += isZhCN(pathname) ? 'zh-cn' : 'en-us';
    })();
    `,
  ],
});
