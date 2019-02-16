# umi-plugin-preload

[![NPM version](https://img.shields.io/npm/v/umi-plugin-preload.svg?style=flat)](https://npmjs.org/package/umi-plugin-preload)
[![NPM downloads](http://img.shields.io/npm/dm/umi-plugin-preload.svg?style=flat)](https://npmjs.org/package/umi-plugin-preload)

Support preload async chunk for improve page loading performance

## Usage

Configure in `.umirc.js`,

```js
export default {
  plugins: [
    ['umi-plugin-preload', options],
  ],
}
```

## Option

```js
{
  // useRawFileName 设置为 true 之后 preload.json 中的内容会去掉 hash 值
  // test
  useRawFileName: false, // default is false
}
```

## Features (PR welcome)

- [x] 生成 preload.json
- [ ] 支持自动往 HTML 中添加 JS

## LICENSE

MIT
