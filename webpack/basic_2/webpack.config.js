const path = require('path');
//css 파일을 변도로 분리하기 위해 MiniCssExtractPlugin 플로그인 설정 추가
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'none',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins:[
    new MiniCssExtractPlugin()
  ]
}