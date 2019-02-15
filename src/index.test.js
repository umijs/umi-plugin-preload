import { getPreloadData } from './index';

describe('getPreloadData', () => {
  it('getPreloadData', () => {
    expect(getPreloadData({
      compilation: {
        chunkGroups: [{
          name: 'p__user',
          chunks: [{
            name: 'p__user',
          }],
        }, {
          name: 'p__index',
          chunks: [{
            name: 'components__test',
          }, {
            name: 'p__index__abc',
          }, {
            name: 'p__index__123',
          }],
        }, {
          name: 'p__b',
          chunks: [{
            name: 'components__test',
          }, {
            name: 'p__b',
          }],
        }, {
          name: 'p__h5b',
          chunks: [{
            name: 'components__test',
          }, {
            name: 'p__h5b',
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
    }])).toEqual({
      '/user': ['p__user'],
      '/': ['components__test', 'p__index__abc', 'p__index__123'],
      '/b': ['components__test', 'p__index__abc', 'p__index__123', 'p__b'],
      '/h5b': ['components__test', 'p__index__abc', 'p__index__123', 'p__h5b'],
    });
  });
});


