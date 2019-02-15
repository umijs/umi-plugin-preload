import { getPreloadData } from './index';

describe('getPreloadData', () => {
  it('getPreloadData', () => {
    expect(getPreloadData({
      compilation: {
        chunkGroups: [{
          name: 'p__user',
          chunks: [{
            files: [
              'p__user.12a45678.async.js',
              'p__user.12v45678.chunk.css',
              'p__user.js.map',
              'xxx.hot-update.js',
            ],
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
      path: '/user',
      component: 'page/user.ts',
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
    }], true)).toEqual({
      '/user': ['p__user.js', 'p__user.css'],
      '/': ['components__test.js', 'p__index__abc.js', 'p__index__123.js'],
      '/b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__b.js'],
      '/h5b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__h5b.js'],
    });
  });
});


