import getChunkByPath from './getChunkByPath';

describe('getChunkByPath', () => {
  const preloadConfig = {
    routes: [{
      path: '/test'
    }, {
      path: '/user/:id',
      exact: true,
    }, {
      path: '/',
      preloadKey: '/',
      exact: false,
      routes: [{
        path: '/b',
        preloadKey: '/b',
        exact: true,
      }, {
        path: '/b2',
        preloadKey: '/h5b',
        exact: true,
      }],
    }],
    preloadMap: {
      '/user/:id': ['p__user.js', 'p__user.css', 'p__user__model.js.js', 'p__user__test__models__data.js.js'],
      '/': ['components__test.js', 'p__index__abc.js', 'p__index__123.js'],
      '/b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__b.js'],
      '/h5b': ['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__h5b.js'],
    }
  };

  it('get right', () => {
    expect(getChunkByPath('/', preloadConfig)).toEqual(['components__test.js', 'p__index__abc.js', 'p__index__123.js']);
    expect(getChunkByPath('/user/123', preloadConfig)).toEqual(['p__user.js', 'p__user.css', 'p__user__model.js.js', 'p__user__test__models__data.js.js']);
    expect(getChunkByPath('/b2', preloadConfig)).toEqual(['components__test.js', 'p__index__abc.js', 'p__index__123.js', 'p__h5b.js']);
  });

  it('not find', () => {
    expect(getChunkByPath('/test', preloadConfig)).toEqual([]);
  });

  it('lack args', () => {
    expect(getChunkByPath('/test')).toEqual([]);
  });
});


