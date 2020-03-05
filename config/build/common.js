const Config = require('webpack-chain')
const merge = require('merge-deep')
const nodeExternals = require('webpack-node-externals')
const path = require('path')
const webpack = require('webpack')

const BABEL_OPTIONS = {
  babelrc: false,
  cacheDirectory: true,
  plugins: [
    ['@babel/proposal-decorators', {
      legacy: true,
    }],
    ['@babel/proposal-class-properties', {
      loose: true,
    }],
    '@babel/proposal-do-expressions',
    '@babel/proposal-export-default-from',
    '@babel/proposal-export-namespace-from',
    '@babel/proposal-function-bind',
    '@babel/proposal-logical-assignment-operators',
    '@babel/proposal-nullish-coalescing-operator',
    '@babel/proposal-numeric-separator',
    '@babel/proposal-optional-catch-binding',
    '@babel/proposal-optional-chaining',
    ['@babel/proposal-pipeline-operator', {
      proposal: 'smart',
    }],
    '@babel/proposal-throw-expressions',
    '@babel/syntax-dynamic-import',
    ['inline-react-svg', {
      svgo: {
        plugins: [
          { cleanupAttrs: true },
          { cleanupListOfValues: true },
          { cleanupNumericValues: true },
          { collapseGroups: true },
          { convertPathData: true },
          { convertShapeToPath: true },
          { convertTransform: true },
          { mergePaths: true },
          { removeComments: true },
          { removeDoctype: true },
          { removeEditorsNSData: true },
          { removeEmptyAttrs: true },
          { removeEmptyContainers: true },
          { removeEmptyText: true },
          { removeHiddenElems: true },
          { removeMetadata: true },
          { removeNonInheritableGroupAttrs: true },
          { removeRasterImages: true },
          { removeScriptElement: true },
          { removeUnknownsAndDefaults: true },
          { removeUnusedNS: true },
          { removeUselessDefs: true },
          { removeUselessStrokeAndFill: true },
          { removeXMLNS: true },
          { removeXMLProcInst: true },
        ],
      },
    }],
    'lodash',
    ['ramda', {
      useES: true,
    }],
    'react-loadable/babel',
  ],
  presets: [
    '@babel/typescript',
  ],
}

const client = new Config()
const server = new Config()

client
  .name('client')
  .context(path.resolve('./src'))
  .mode('development')
  .target('web')

client
  .entry('main')
    .add('./client')

client.output
  .chunkFilename('js/[name].js')
  .filename('js/[name].js')
  .path(path.resolve('build', 'public'))
  .publicPath('/')

client.module
  .rule('babel')
    .test(/\.(j|t)sx?$/)
    .exclude
      .add(/(node_modules\/(?!@fortawesome))/)
      .add(/vendor/)
      .end()
    .use('babel')
      .loader('babel-loader')
      .options(
        merge(
          BABEL_OPTIONS,
          {
            plugins: [
              ['module:fast-async', {
                compiler: {
                  lazyThenables: true,
                  parser: {
                    sourceType: 'module',
                  },
                  promises: true,
                  wrapAwait: true,
                },
                useRuntimeModule: true,
              }],
            ],
            presets: [
              ['@babel/env', {
                corejs: {
                  proposals: true,
                  version: 3,
                },
                modules: false,
                targets: {
                  browsers: ['last 2 major versions'],
                },
                useBuiltIns: 'usage',
              }],
            ],
          },
        ),
      )

client.module
  .rule('style-raw')
    .test(/\.css$/)
    .use('style')
      .loader('style-loader')
      .options({
        insert: element => {
          var head = document.querySelector('head')
          head.insertBefore(element, head.firstElementChild)
        },
      })
      .end()
    .use('css')
      .loader('css-loader')

client.module
  .rule('fonts')
    .test(/\.(woff2?)$/)
    .use('url')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'fonts/[hash].[ext]',
      })

client.module
  .rule('images')
    .test(/\.(jpe?g|png|webp|ico)$/)
    .use('url')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'images/[hash].[ext]',
      })

client.module
  .rule('videos')
    .test(/\.(mp4|webm)$/)
    .use('url')
      .loader('url-loader')
      .options({
        limit: 8192,
        name: 'videos/[hash].[ext]',
      })


client.resolve
  .enforceExtension(false)
  .extensions
    .add('.ts')
    .add('.tsx')
    .add('.wasm')
    .add('.mjs')
    .add('.js')
    .add('.jsx')
    .add('.json')
    .end()
  .modules
    .add(path.resolve('src'))
    .add(path.resolve('vendor'))
    .add(path.resolve('node_modules'))
    .end()

client
  .plugin('define')
  .use(webpack.DefinePlugin, [
    {
      __DEV__: JSON.stringify(true),
      __SSR__: JSON.stringify(false),
    },
  ])

client
  .plugin('ignore-moment')
  .use(webpack.IgnorePlugin, [
    { contextRegExp: /moment/, resourceRegExp: /^\.\/locale$/ },
  ])

server
  .name('server')
  .context(path.resolve('./src'))
  .target('node')

server
  .entry('main')
    .add('./server')

server.output
  .filename('app.js')
  .libraryTarget('commonjs-module')
  .path(path.resolve('dist'))
  .pathinfo(false)

server.module
  .rule('babel')
    .test(/\.(j|t)sx?$/)
    .exclude
      .add(/(node_modules\/(?!@fortawesome))/)
      .add(/vendor/)
      .end()
    .use('babel')
      .loader('babel-loader')
      .options(
        merge(
          BABEL_OPTIONS,
          {
            presets: [
              ['@babel/env', {
                corejs: {
                  proposals: true,
                  version: 3,
                },
                modules: true,
                targets: {
                  node: 'current',
                },
                useBuiltIns: 'usage',
              }],
            ],
          },
        ),
      )

server.module
  .rule('fonts')
    .test(/\.(woff2?)$/)
    .use('url')
      .loader('url-loader')
      .options({
        emitFile: false,
        limit: 8192,
        name: 'fonts/[hash].[ext]',
      })

server.module
  .rule('images')
    .test(/\.(jpe?g|png|webp|ico)$/)
    .use('url')
      .loader('url-loader')
      .options({
        emitFile: false,
        limit: 8192,
        name: 'images/[hash].[ext]',
      })

server.module
  .rule('videos')
    .test(/\.(mp4|webm)$/)
    .use('url')
      .loader('url-loader')
      .options({
        emitFile: false,
        limit: 8192,
        name: 'videos/[hash].[ext]',
      })

server.resolve
  .enforceExtension(false)
  .extensions
    .add('.ts')
    .add('.tsx')
    .add('.wasm')
    .add('.mjs')
    .add('.js')
    .add('.jsx')
    .add('.json')
    .end()
  .modules
    .add(path.resolve('src'))
    .add(path.resolve('vendor'))
    .add(path.resolve('node_modules'))
    .end()

server
  .plugin('define')
  .use(webpack.DefinePlugin, [
    {
      __DEV__: JSON.stringify(true),
      __SSR__: JSON.stringify(false),
    },
  ])

server
  .plugin('ignore-moment')
  .use(webpack.IgnorePlugin, [
    { contextRegExp: /moment/, resourceRegExp: /^\.\/locale$/ },
  ])

server
  .externals(
    [
      (_context, request, callback) => {
        if (/stats\.json$/.test(request)) {
          return callback(null, `commonjs ${ request }`)
        }
        callback()
      },
      nodeExternals(),
    ],
  )

module.exports = { client, server }