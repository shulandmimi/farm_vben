import { defineConfig, loadEnv } from '@farmfe/core';
import pkg from './package.json';
import moment from 'moment';
// import { loadEnv } from 'vite';
import { resolve } from 'path';
import { generateModifyVars } from './build/generate/generateModifyVars';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import less from '@farmfe/js-plugin-less';
import vue from '@vitejs/plugin-vue';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: moment().format('YYYY-MM-DD HH:mm:ss'),
};

export default defineConfig(({ mode }) => {
  const root = process.cwd();

  const env = loadEnv(mode, root);

  // // The boolean type read by loadEnv is a string. This function can be converted to boolean type
  const viteEnv = wrapperEnv(env);

  // const isBuild = mode === 'production';

  return {
    root: './',
    compilation: {
      presetEnv: false,
      sourcemap: false,
      resolve: {
        alias: {
          'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
          '/@/': pathResolve('src') + '/',
          '/#/': pathResolve('types'),
        },
        extensions: ['js', 'ts', 'vue', 'css', 'less'],
      },
      define: {
        __COLOR_PLUGIN_OUTPUT_FILE_NAME__: 0,
        __PROD__: 1,
        __COLOR_PLUGIN_OPTIONS__: 1,
      },
      external: ['/#/'],
    },
    // root: '.',
    // compilation: {
    //   presetEnv: false,
    //   resolve: {
    //     // alias: {
    //     //   'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
    //     //   '/@/': pathResolve('src') + '/',
    //     //   '/#/': pathResolve('types') + '/',
    //     // },
    //   },
    //   define: {
    //     __INTLIFY_PROD_DEVTOOLS__: false,
    //     __APP_INFO__: JSON.stringify(__APP_INFO__),
    //   },
    // },
    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       modifyVars: generateModifyVars(),
    //       javascriptEnabled: true,
    //     },
    //   },
    // },
    envPrefix: 'VITE',
    vitePlugins: [vue(), ...createVitePlugins(viteEnv, mode === 'production')],
    plugins: [
      less({
        lessOptions: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      }),
    ],
    // The vite plugin used by the project. The quantity is large, so it is separately extracted and managed
    // vitePlugins: createVitePlugins(viteEnv, isBuild),
    // optimizeDeps: {
    //   // @iconify/iconify: The dependency is dynamically and virtually loaded by @purge-icons/generated, so it needs to be specified explicitly
    //   include: [
    //     '@iconify/iconify',
    //     'ant-design-vue/es/locale/zh_CN',
    //     'moment/dist/locale/zh-cn',
    //     'ant-design-vue/es/locale/en_US',
    //     'moment/dist/locale/eu',
    //   ],
    //   exclude: ['vue-demi', 'consolidate'],
    // },
  };
});
