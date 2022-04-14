const path = require('path');
const webpack = require('webpack');

const handler = (percentage, message, ...args) => {
  // e.g. Output each progress message directly to the console:
  console.info(percentage, message, ...args);
};



module.exports = {
  mode: 'none',
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
    sub: './src/sub.js'
  },
  output: {
    // filename: 'main.js',
    filename: '[name].bundle.js', //entry 속성을 포함
    // filename: '[id].main.js', //모듈 id를 포함
    // filename: '[name].[hash].main.js', //매 빌드시 마다 고유 해시값을 붙임
    // filename: '[chunkhash].main.js', //웹팩의 각 모듈 내용을 기준으로 생성된 해시값을 붙임
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['css-loader']
      }
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(handler)
  ]
}