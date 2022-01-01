const { client } = require('./common.cjs')
const HTMLPlugin = require('html-webpack-plugin')
const merge = require('merge-deep')
const path = require('path')
const TimeFixPlugin = require('time-fix-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')

const enableWDYR = process.env.WHY_DID_YOU_RENDER != null

client
  .mode('development')
  .devtool('source-map')

client.output
  .chunkFilename('js/[name].[contenthash].js')
  .filename('js/[name].[contenthash].js')

client.module
  .rule('babel')
  .use('babel')
  .tap(options =>
    merge(options, {
      presets: [
        [
          '@babel/react',
          {
            development: true,
            importSource: enableWDYR
              ? '@welldone-software/why-did-you-render'
              : 'react',
            runtime: 'automatic',
          },
        ],
      ],
      plugins: [
        'react-refresh/babel',
        [
          'styled-components',
          {
            displayName: true,
            fileName: true,
            ssr: false,
          },
        ],
      ],
    }),
  )
  .end()

if (enableWDYR) {
  client
    .entry('main')
    .prepend('./bootstrap/client/wdyr')
}

client
  .entry('main')
  .prepend('webpack-hot-middleware/client')

client
  .plugin('define')
  .tap(([options]) => [merge(options, { __DEV__: JSON.stringify(true) })])

client.plugin('html').use(HTMLPlugin, [
  {
    chunks: ['main'],
    filename: 'index.html',
    hash: true,
    scriptLoading: 'module',
    template: './bootstrap/index.html',
  },
])

client
  .plugin('hmr')
  .use(webpack.HotModuleReplacementPlugin)

client
  .plugin('fast-refresh')
  .use(ReactRefreshPlugin)

client.optimization.usedExports(false)

module.exports = { client }