// ref:
// - https://umijs.org/plugin/develop.html
// - 参考 https://github.com/GoogleChromeLabs/preload-webpack-plugin/blob/master/index.js 这个实现
// - chunkGroup 的数据格式参考 https://github.com/webpack/webpack/blob/9fd6af8121e71718e786a2a18894d48acf2c47ed/lib/ChunkGroup.js
import { writeFileSync } from 'fs';
import { join } from 'path';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';

// normalizeEntry copy from https://github.com/umijs/umi/blob/master/packages/umi-build-dev/src/routes/routesToJSON.js#L83
function normalizeEntry(entry) {
  return entry
    .replace(/^.(\/|\\)/, '')
    .replace(/(\/|\\)/g, '__')
    .replace(/\.jsx?$/, '')
    .replace(/\.tsx?$/, '');
}

function patchDataWithRoutes(preloadData, routes = [], chunkGroupData, parentChunks = []) {
  routes.forEach(route => {
    const key = route.preloadKey || route.path || '__404'; // __404 是为了配置路由的情况下的 404 页面
    preloadData[key] = preloadData[key] || [];
    const webpackChunkName = normalizeEntry(route.component || 'common_component')
      .replace(/^src__/, '')
      .replace(/^pages__/, 'p__')
      .replace(/^page__/, 'p__');
    const chunks = flatten(chunkGroupData.filter(group => {
      // 这里用 indexOf 而不用精确匹配是为了兼容 dva model 也使用动态加载的情况
      return group.name.indexOf(webpackChunkName) === 0;
    }).map(group => group.chunks));
    preloadData[key] = uniq(preloadData[key].concat(parentChunks).concat(chunks));
    patchDataWithRoutes(preloadData, route.routes, chunkGroupData, preloadData[key])
  });
}

function getPreloadData({ compilation }, routes, useRawFileName) {
  const allChunks = compilation.chunkGroups;
  // preloadData like this:
  // {
  //   '/a': ['xxx.js', 'xxx.css'], 
  // }
  //
  const preloadData = {};
  const chunkGroupData = allChunks.map((group) => {
    return {
      name: group.name,
      chunks: flatten(group.chunks.map(chunk => {
        return chunk.files.filter(file => !/(\.map$)|(hot\-update\.js)/.test(file)).map(file => {
          if (useRawFileName) {
            return file.replace(/\.\w{8}.chunk.css$/, '.css').replace(/\.\w{8}.async.js$/, '.js');;
          }
          return file;
        });
      })),
    };
  });
  patchDataWithRoutes(preloadData, routes, chunkGroupData);
  return preloadData;
}

const PRELOAD_FILENAME = 'preload.json';

export default function (api, options = {}) {
  const { paths } = api;
  const { useRawFileName = false } = options;

  api.onDevCompileDone(({ stats }) => {
    const preloadData = getPreloadData(stats, api.routes, false);
    const filePath = join(paths.absTmpDirPath, PRELOAD_FILENAME);
    writeFileSync(filePath, JSON.stringify(preloadData, null, 2));
  });

  api.onBuildSuccess(({ stats }) => {
    const preloadData = getPreloadData(stats, api.routes, useRawFileName);
    const filePath = join(paths.absOutputPath, PRELOAD_FILENAME);
    writeFileSync(filePath, JSON.stringify(preloadData, null, 2));
  });
}

export {
  getPreloadData, // export for test
};