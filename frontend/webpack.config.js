const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

var config = merge(common, {
    mode: 'development',
    devServer: {
        contentBase: path.resolve('./frontend/public/'),
        // Данные параметры не имеют смысла, т.к. вебпак выполняется в пользовательской среде
        port: 8080,
        host: 'localhost',
    }
})

module.exports = config