// ref:
// - https://umijs.org/plugin/develop.html
// - 参考 https://github.com/GoogleChromeLabs/preload-webpack-plugin/blob/master/index.js 这个实现
// - chunkGroup 的数据格式参考 https://github.com/webpack/webpack/blob/9fd6af8121e71718e786a2a18894d48acf2c47ed/lib/ChunkGroup.js
import { writeFileSync } from 'fs';
import { join } from 'path';

function getPreloadData({ compilation }) {
  const allChunks = compilation.chunkGroups;
  const preloadData = allChunks.map((group) => {
    return {
      name: group.name,
      chunks: group.chunks.map(chunk => chunk.name),
    };
  });
  return preloadData;
}

const PRELOAD_FILENAME = 'preload.json';

export default function (api, options) {
  const { paths } = api;

  api.onDevCompileDone(({ stats }) => {
    const preloadData = getPreloadData(stats);
    const filePath = join(paths.absTmpDirPath, PRELOAD_FILENAME);
    writeFileSync(filePath, JSON.stringify(preloadData, null, 2));
  });

  api.onBuildSuccess(({ stats }) => {
    const preloadData = getPreloadData(stats);
    const filePath = join(paths.absOutputPath, PRELOAD_FILENAME);
    writeFileSync(filePath, JSON.stringify(preloadData, null, 2));
  });
}
