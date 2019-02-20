// ref:
// - https://umijs.org/plugin/develop.html
// - 参考 https://github.com/GoogleChromeLabs/preload-webpack-plugin/blob/master/index.js 这个实现
// - chunkGroup 的数据格式参考 https://github.com/webpack/webpack/blob/9fd6af8121e71718e786a2a18894d48acf2c47ed/lib/ChunkGroup.js
import { writeFileSync } from 'fs';
import { join } from 'path';
import flatten from 'lodash/flatten';
import uniq from 'lodash/uniq';
import getChunkByPath from './getChunkByPath';

// normalizeEntry copy from https://github.com/umijs/umi/blob/master/packages/umi-build-dev/src/routes/routesToJSON.js#L83
function normalizeEntry(entry) {
  return entry
    .replace(/^.(\/|\\)/, '')
    .replace(/(\/|\\)/g, '__')
    .replace(/\.jsx?$/, '')
    .replace(/\.tsx?$/, '');
}

function patchDataWithRoutes(preloadMap, routes = [], chunkGroupData, parentChunks = [], dva) {
  routes.forEach(route => {
    const key = route.preloadKey || route.path || '__404'; // __404 是为了配置路由的情况下的 404 页面
    preloadMap[key] = preloadMap[key] || [];
    const webpackChunkName = normalizeEntry(route.component || 'common_component')
      .replace(/^src__/, '')
      .replace(/^pages__/, 'p__')
      .replace(/^page__/, 'p__');
    const chunks = flatten(chunkGroupData.filter(group => {
      let isMatch = false;
      if (group.name === webpackChunkName) {
        isMatch = true;
      } else if (dva) {
        // p__user__test__models__data.js.js -> p_user__test
        const groupNameWithoutModel = group.name.replace(/__model.+$/, '');
        if (webpackChunkName.indexOf(groupNameWithoutModel) === 0) {
          // 只要 model 是在路由对应组件的文件夹下（包含上层文件夹下）那么 model 就会被 umi-plugin-dva 自动挂载
          // 这种情况下对应的 model 也需要加到预加载中
          isMatch = true;
        }
      }
      return isMatch;
    }).map(group => group.chunks));
    preloadMap[key] = uniq(preloadMap[key].concat(parentChunks).concat(chunks));
    patchDataWithRoutes(preloadMap, route.routes, chunkGroupData, preloadMap[key], dva)
  });
}

function getPreloadData({ compilation }, routes, { useRawFileName, dva }) {
  const allChunks = compilation.chunkGroups;
  // preloadData like this:
  // {
  //   '/a': ['xxx.js', 'xxx.css'], 
  // }
  //
  const preloadMap = {};
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
  patchDataWithRoutes(preloadMap, routes, chunkGroupData, [], dva);
  return {
    routes: parseRoutesInfo(routes),
    preloadMap,
  };
}

function parseRoutesInfo(routes) {
  return routes.map(route => {
    const ret = {
      path: route.path,
      exact: route.exact,
      preloadKey: route.preloadKey || route.path ||  '__404',
    }
    if (route.routes) {
      ret.routes = parseRoutesInfo(route.routes);
    }
    return ret;
  });
}

const PRELOAD_FILENAME = 'preload.json';

export default function (api, options = {}) {
  const { paths } = api;
  const { useRawFileName = false, dva = false } = options;

  api.onDevCompileDone(({ stats }) => {
    const preloadData = getPreloadData(stats, api.routes, {
      useRawFileName: false,
      dva,
    });
    const filePath = join(paths.absTmpDirPath, PRELOAD_FILENAME);
    writeFileSync(filePath, JSON.stringify(preloadData, null, 2));
  });

  api.onBuildSuccess(({ stats }) => {
    const preloadData = getPreloadData(stats, api.routes, {
      useRawFileName,
      dva,
    });
    const filePath = join(paths.absOutputPath, PRELOAD_FILENAME);
    writeFileSync(filePath, JSON.stringify(preloadData, null, 2));
  });
}

export {
  getPreloadData, // export for test
  getChunkByPath,
};
