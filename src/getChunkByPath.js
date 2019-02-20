// 实现参考 https://github.com/ReactTraining/react-router/tree/b835c8fc07b6dcb92caf6a89151493346524e012/packages/react-router-config

import matchRoutes from './matchRoutes';

const getChunkByPath = (path, config) => {
  if (!path || !config) {
    console.error('getChunkByPath require path and config args.');
    return [];
  }
  const { preloadMap = {}, routes = [] } = config;
  const matchedRoutes = matchRoutes(routes, path);
  const matchRoute = matchedRoutes.pop();
  let chunks = [];
  if (matchRoute && matchRoute.route) {
    const { preloadKey, path } = matchRoute.route;
    if (preloadMap[preloadKey || path]) {
      chunks = preloadMap[preloadKey || path];
    }
  }
  return chunks;
};

export default getChunkByPath;
