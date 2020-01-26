const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const RemovePlugin= require('remove-files-webpack-plugin')

module.exports = {
    entry: {
        main: [
            path.resolve('./frontend/index.js')
        ]
    },
    output: {
        path: path.resolve('./frontend/public/'), 
        filename: '[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|backend|frontend\/public)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        'modules': 'false',
                                        'useBuiltIns': 'usage',
                                        'targets': '> 0.25%, not dead',
                                        'corejs': 3
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true
                        }
                    }, 
                    'css-loader'
                ]               
            }
        ]
    },
    resolve: {
        alias: {}
    },
    plugins: [
        new RemovePlugin({
            before: {
                root: path.resolve('./frontend/public/'),
                include: []
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name].bundle.css'
        })
    ]
}