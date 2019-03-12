import { getPreloadData, getChunkByPath } from './index';

describe('getPreloadData', () => {
  it('getPreloadData', () => {
    expect(getPreloadData({
      compilation: {
        chunkGroups: [{
          name: 'p__user__test__user',
          chunks: [{
            files: [
              'p__user.12a45678.async.js',
              'p__user.12v45678.chunk.css',
              'p__user.js.map',
              'xxx.hot-update.js',
            ],
          }],
        }, {
          name: 'p__user__model.js',
          chunks: [{
            files: ['p__user__model.js.js'],
          }],
        }, {
          name: 'p__user__test__models__data.js',
          chunks: [{
            files: ['p__user__test__models__data.js.js'],
          }],
        }, {
          name: 'p__index',
          chunks: [{
            files: ['components__test.js'],
          }, {
            files: ['p__index__abc.js', 'p__index__123.js'],
          }],
        }, {
          name: 'p__b',
          chunks: [{
            files: ['components__test.js'],
          }, {
            files: ['p__b.js']
          }],
        }, {
          name: 'p__h5b',
          chunks: [{
            files: ['components__test.js'],
          }, {
            files: ['p__h5b.js'],
          }],
        }],
      },
    }, [{
      path: '/testredirect',
      redirect: '/user',
    }, {
      path: '/user',
      component: 'page/user/test/user.ts',
      exact: true,
    }, {
      path: '/',
      component: 'pages/index.jsx',
      routes: [{
        path: '/b',
        component: 'pages/b.jsx',
      }, {
        path: '/b',
        preloadKey: '/h5b',
        component: 'pages/h5b.jsx',
      }],
    }], {
      dva: true,
      useRawFileName: true,
    })).toEqual({
      routes: [{
        path: '/testredirect',
        preloadKey: '/testredirect',
        redirect: '/user',
      }, {
        path: '/user',
        preloadKey: '/user',
        exact: true,
      }, {
        path: '/',
        preloadKey: '/',
        routes: [{
          path: '/b',
          preloadKey: '/b',
        }, {
          path: '/b',
          preloadKey: '/h5b',
        }],
      }],
      preloadMap: {
        '/testredirect': [],
        '/user': ['p__user.js', 'p__user.css', 'p__user__model.js.js', 'p__user__test__models__data.js.js'],
        '/': ['components__test.js', 'p__index__abc.js', 'p__index__123.js'],
        '/b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__b.js'],
        '/h5b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__h5b.js'],
      }
    });
  });

  it('getChunkByPath exist', () => {
    expect(typeof getChunkByPath).toEqual('function');
  });

  it.only('preloadKeyGenerator', () => {
    expect(getPreloadData({
      compilation: {
        chunkGroups: [{
          name: 'p__user__test__user',
          chunks: [{
            files: [
              'p__user.12a45678.async.js',
              'p__user.12v45678.chunk.css',
              'p__user.js.map',
              'xxx.hot-update.js',
            ],
          }],
        }, {
          name: 'p__user__model.js',
          chunks: [{
            files: ['p__user__model.js.js'],
          }],
        }, {
          name: 'p__user__test__models__data.js',
          chunks: [{
            files: ['p__user__test__models__data.js.js'],
          }],
        }, {
          name: 'p__index',
          chunks: [{
            files: ['components__test.js'],
          }, {
            files: ['p__index__abc.js', 'p__index__123.js'],
          }],
        }, {
          name: 'p__b',
          chunks: [{
            files: ['components__test.js'],
          }, {
            files: ['p__b.js']
          }],
        }, {
          name: 'p__h5b',
          chunks: [{
            files: ['components__test.js'],
          }, {
            files: ['p__h5b.js'],
          }],
        }],
      },
    }, [{
      path: '/testredirect',
      redirect: '/user',
    }, {
      path: '/user',
      component: 'page/user/test/user.ts',
      preloadKey: 'notworkkey',
      exact: true,
    }, {
      path: '/',
      component: 'pages/index.jsx',
      routes: [{
        path: '/b',
        component: 'pages/b.jsx',
      }, {
        path: '/b',
        preloadKey: '/h5b',
        component: 'pages/h5b.jsx',
      }],
    }], {
      dva: true,
      useRawFileName: true,
      preloadKeyGenerator: (route) => {
        if (route.path === '/b') {
          return `prefix_b_${route.preloadKey || route.path}`;
        }
        return `prefix__${route.path}`
      },
    })).toEqual({
      routes: [{
        path: '/testredirect',
        preloadKey: 'prefix__/testredirect',
        redirect: '/user',
      }, {
        path: '/user',
        preloadKey: 'prefix__/user',
        exact: true,
      }, {
        path: '/',
        preloadKey: 'prefix__/',
        routes: [{
          path: '/b',
          preloadKey: 'prefix_b_/b',
        }, {
          path: '/b',
          preloadKey: 'prefix_b_/h5b',
        }],
      }],
      preloadMap: {
        'prefix__/testredirect': [],
        'prefix__/user': ['p__user.js', 'p__user.css', 'p__user__model.js.js', 'p__user__test__models__data.js.js'],
        'prefix__/': ['components__test.js', 'p__index__abc.js', 'p__index__123.js'],
        'prefix_b_/b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__b.js'],
        'prefix_b_/h5b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__h5b.js'],
      }
    });
  })
});


