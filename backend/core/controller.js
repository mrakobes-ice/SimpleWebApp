var express = require('express')

function Controller(mountUrl)
{
    var router = express.Router()
    Object.defineProperty(router, 'mountUrl', {
        get: () => mountUrl || '/'
    })
    return router
}
Controller.EmptyController = new Controller()
module.exports = Controller