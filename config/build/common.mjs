import Config from 'webpack-chain'
import CopyPlugin from 'copy-webpack-plugin'
import { fileURLToPath } from 'url'
import LoadablePlugin from '@loadable/webpack-plugin'
import merge from 'merge-deep'
import nodeExternals from 'webpack-node-externals'
import path from 'path'
import PNPPlugin from 'pnp-webpack-plugin'
import webpack from 'webpack'

export const client = new Config()
export const server = new Config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const BABEL_OPTIONS = {
    babelrc: false,
    cacheDirectory: true,
    ignore: [/node_modules/],
    presets: ['@babel/typescript'],
    plugins: [
        '@babel/proposal-async-generator-functions',
        [
            '@babel/proposal-decorators',
            {
                decoratorsBeforeExport: false,
                legacy: false,
            },
        ],
        '@babel/proposal-class-properties',
        '@babel/proposal-do-expressions',
        '@babel/proposal-export-default-from',
        '@babel/proposal-export-namespace-from',
        '@babel/proposal-function-bind',
        '@babel/proposal-function-sent',
        '@babel/proposal-logical-assignment-operators',
        '@babel/proposal-nullish-coalescing-operator',
        '@babel/proposal-numeric-separator',
        '@babel/proposal-optional-catch-binding',
        '@babel/proposal-optional-chaining',
        '@babel/plugin-proposal-partial-application',
        [
            '@babel/proposal-pipeline-operator',
            {
                proposal: 'hack',
                topicToken: '#',
            },
        ],
        '@babel/proposal-private-methods',
        '@babel/proposal-throw-expressions',
        '@babel/proposal-unicode-property-regex',
        '@babel/syntax-dynamic-import',
        ['lodash', {
            id: 'lodash-es',
        }],
        [
            'ramda',
            {
                useES: true,
            },
        ],
        '@loadable/babel-plugin',
        'macros',
    ],
}

client
    .name('client')
    .context(path.resolve('./src'))
    .target('web')
    .stats('minimal')

client.entry('main').add('./bootstrap/client').end()

client.output
    .path(path.resolve('dist'))
    .publicPath('/')

client.module
    .rule('babel')
    .test(/\.(j|mj|t)sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader('babel-loader')
    .options(
        merge(BABEL_OPTIONS, {
            presets: [
                [
                    '@babel/env',
                    {
                        bugfixes: true,
                        corejs: {
                            proposals: true,
                            version: 3,
                        },
                        modules: false,
                        targets: {
                            browsers: [
                                '>10% in US',
                                'last 2 major versions',
                                'not dead',
                                'not ie >= 0',
                            ],
                        },
                        useBuiltIns: 'usage',
                    },
                ],
            ],
            plugins: [
                [
                    'polyfill-corejs3',
                    {
                        method: 'entry-global',
                        targets: {
                            browsers: [
                                'last 2 major versions and > 5% in US and not dead and not ie > 0',
                            ],
                        },
                    },
                ],
                [
                    'polyfill-regenerator',
                    {
                        method: 'usage-pure',
                        targets: {
                            browsers: [
                                'last 2 major versions and > 5% in US and not dead and not ie > 0',
                            ],
                        },
                    },
                ],
            ],
        }),
    )

client.module
    .rule('fonts')
    .test(/\.(woff2?)$/)
    .set('type', 'asset')
    .set('generator', {
        filename: 'fonts/[name].[hash][ext]',
    })

client.module
    .rule('images')
    .test(/\.(jpe?g|png|webp|ico)$/)
    .set('type', 'asset')
    .set('generator', {
        filename: 'images/[name].[hash][ext]',
    })

client.module
    .rule('videos')
    .test(/\.(mp4|webm)$/)
    .set('type', 'asset')
    .set('generator', {
        filename: 'videos/[name].[hash][ext]',
    })

client.module
    .rule('svg')
    .test(/\.svg$/)
    .use('svgr')
    .loader('@svgr/webpack')
    .options({
        ref: true,
        svgo: true,
    })

client.module
    .rule('styles')
    .test(/\.css$/)
    .use('style')
    .loader('style-loader')
    .end()
    .use('css')
    .loader('css-loader')
    .end()

client.module
    .rule('sass')
    .test(/\.s[ac]ss$/)
    .use('style')
    .loader('style-loader')
    .end()
    .use('css')
    .loader('css-loader')
    .end()
    .use('resolve-url')
    .loader('resolve-url-loader')
    .end()
    .use('sass')
    .loader('sass-loader')
    .end()

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
    .modules.add(path.resolve('src'))
    .add(path.resolve('vendor'))
    .add(path.resolve('node_modules'))
    .end()

client.plugin('define').use(webpack.DefinePlugin, [
    {
        __SSR__: JSON.stringify(false),
    },
])

client.plugin('loadable').use(LoadablePlugin)

client
    .plugin('copy-hyphenopoly')
    .use(CopyPlugin, [
        {
            patterns: [
                {
                    from: path.resolve('node_modules/hyphenopoly/min/*.js'),
                    to: path.resolve('dist/hyphenopoly/[name][ext]'),
                    toType: 'template',
                },
                {
                    from: path.resolve('node_modules/hyphenopoly/min/patterns/en-us.wasm'),
                    to: path.resolve('dist/hyphenopoly/[name][ext]'),
                    toType: 'template',
                },
            ],
        },
    ])

client.cache({
    buildDependencies: {
        config: [
            path.resolve(__dirname, 'common.mjs'),
            path.resolve(__dirname, 'development.mjs'),
            path.resolve(__dirname, 'staging.mjs'),
            path.resolve(__dirname, 'production.mjs'),
        ],
    },
    type: 'filesystem',
})

client
    .merge({
        experiments: {
            outputModule: true,
        },
    })

server.name('server').context(path.resolve('./src')).target('node')

server.entry('main').add('./bootstrap/server')

server.output
    .filename('app.js')
    .libraryTarget('commonjs-module')
    .path(path.resolve('dist'))
    .pathinfo(false)

server.module
    .rule('babel')
    .test(/\.(j|mj|t)sx?$/)
    .exclude.add(/node_modules/)
    .end()
    .use('babel')
    .loader('babel-loader')
    .options(
        merge(BABEL_OPTIONS, {
            presets: [
                [
                    '@babel/env',
                    {
                        bugfixes: true,
                        corejs: {
                            proposals: true,
                            version: 3,
                        },
                        modules: false,
                        targets: {
                            node: 'current',
                        },
                        useBuiltIns: 'usage',
                    },
                ],
            ],
            plugins: [
                [
                    [
                        'polyfill-corejs3',
                        {
                            method: 'entry-global',
                            targets: {
                                node: 'current',
                            },
                        },
                    ],
                    [
                        'polyfill-regenerator',
                        {
                            method: 'usage-pure',
                            targets: {
                                node: 'current',
                            },
                        },
                    ],
                ],
            ],
        }),
    )

server.module
    .rule('fonts')
    .test(/\.(woff2?)$/)
    .set('type', 'asset')
    .set('generator', {
        filename: 'fonts/[name].[hash][ext]',
    })

server.module
    .rule('images')
    .test(/\.(jpe?g|png|webp|ico)$/)
    .set('type', 'asset')
    .set('generator', {
        filename: 'images/[name].[hash][ext]',
    })

server.module
    .rule('videos')
    .test(/\.(mp4|webm)$/)
    .set('type', 'asset')
    .set('generator', {
        filename: 'videos/[name].[hash][ext]',
    })

server.module
    .rule('svg')
    .test(/\.svg$/)
    .use('svgr')
    .loader('@svgr/webpack')
    .options({
        ref: true,
        svgo: true,
    })

server.module
    .rule('styles')
    .test(/\.css$/)
    .use('null')
    .loader('null-loader')

server.module
    .rule('sass')
    .test(/\.s[ca]ss$/)
    .use('null')
    .loader('null-loader')

server.resolve
    .enforceExtension(false)
    .extensions.add('.ts')
    .add('.tsx')
    .add('.wasm')
    .add('.mjs')
    .add('.js')
    .add('.jsx')
    .add('.json')
    .end()
    .modules.add(path.resolve('src'))
    .add(path.resolve('vendor'))
    .add(path.resolve('node_modules'))
    .end()

server.plugin('define').use(webpack.DefinePlugin, [
    {
        __SSR__: JSON.stringify(false),
    },
])

server.plugin('loadable').use(LoadablePlugin)

server.externals([
    (_context, request, callback) => {
        if (/stats\.json$/.test(request)) {
            return callback(null, `commonjs ${ request }`)
        }
        callback()
    },
    nodeExternals(),
])

server.cache({
    buildDependencies: {
        config: [
            path.resolve(__dirname, 'common.mjs'),
            path.resolve(__dirname, 'development.mjs'),
            path.resolve(__dirname, 'staging.mjs'),
            path.resolve(__dirname, 'production.mjs'),
        ],
    },
    type: 'filesystem',
})

server
    .merge({
        experiments: {
            outputModule: true,
        },
    })