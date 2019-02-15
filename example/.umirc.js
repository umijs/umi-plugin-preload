import { join } from 'path';

export default {
  plugins: [
    ['umi-plugin-react', {
      dynamicImport: {
        webpackChunkName: true,
      },
    }],
    join(__dirname, '..', require('../package').main || 'index.js'),
  ],
}
