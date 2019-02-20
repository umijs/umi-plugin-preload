// 参考 https://github.com/ReactTraining/react-router/blob/b835c8fc07b6dcb92caf6a89151493346524e012/packages/react-router-config/modules/matchRoutes.js

import matchPath from './matchPath'

// ensure we're using the exact code for default root match
const computeMatch = (pathname) => {
  return {
    path: "/",
    url: "/",
    params: {},
    isExact: pathname === "/"
  };
};

const matchRoutes = (routes, pathname, /*not public API*/branch = []) => {
  routes.some((route) => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
        ? branch[branch.length - 1].match // use parent match
        : computeMatch(pathname) // use default "root" match

    if (match) {
      branch.push({ route, match })

      if (route.routes) {
        matchRoutes(route.routes, pathname, branch)
      }
    }

    return match
  })

  return branch
}

export default matchRoutes;
