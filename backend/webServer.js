const DEV_MODE = process.env.NODE_ENV !== 'production'

const express = require('express')
const favicon = require('serve-favicon')
const fs = require('fs')
const path = require('path')
const ControllerProxy = require('./core/controllerProxy')
const controllers = {}

// Dev-server parts
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const config = require('../frontend/webpack.config.js')

function controllerFactory(targetPath)
{
  if(!DEV_MODE)
  {
    return require(path.resolve('backend/controller/' + targetPath))
  }
  else
  {
    // Hotreplacment router proxy
    if(!controllers[targetPath])    
      controllers[targetPath] = ControllerProxy(path.resolve('backend/controller/' + targetPath))

    return controllers[targetPath]
  }
}

function applyMiddlewares(app)
{
  if(DEV_MODE)
  {
    config.entry.main.unshift('webpack-hot-middleware/client?reload=true&timeout=1000');

    //Add HMR plugin
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);

    //Enable "webpack-dev-middleware"
    app.use(webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath
    }));

    //Enable "webpack-hot-middleware"
    app.use(webpackHotMiddleware(compiler));
  }

  app.use(express.static(path.resolve('frontend/public')))
  //app.use(favicon('../frontend/public/favicon.ico'))

  var controller = null
  for(var file of fs.readdirSync(path.resolve('backend/controller/')))
  {
    controller = controllerFactory(file)
    app.use(controller.mountUrl, controller)
  //app.use('/birds', mainController);  
  }
}

function watchControllerChanges(app)
{
  // TODO: Реализовать возможность реиспользования освобожденных прокси

  if(DEV_MODE)
  {
    // Watch 
    fs.watch(path.resolve('backend/controller/'), function(event, filename)
    {
      var isNeedCreate = false

      if(controllers[filename] && event === 'change')
      {      
        isNeedCreate = controllers[filename].reinitProxy()

        if(isNeedCreate === 'deactivated')
        {          
          console.log('Controller change mount point')
          delete controllers[filename]
        }
        else console.log('Controller changed')

        isNeedCreate = isNeedCreate === 'deactivated'
      }
      else if(event === 'rename')
      {
        // rename - происходит при добавлении/удалении и переименовании файла
        if(controllers[filename])
        {
          // файл переименовали
          controllers[filename].reinitProxy(true)  // явно разрушаем старый контроллер
          delete controllers[filename]
        }

        isNeedCreate = fs.existsSync(path.resolve('backend/controller/' + filename))
        console.log(isNeedCreate ? 'File renamed' : 'File deleted')
      }

      if(isNeedCreate)
      {
        // Динамически создаем и подключаем контроллер
        var controller = controllerFactory(filename)
        app.use(controller.mountUrl, controller)
      }
    })
  }
}

function WebServer(instanceId)
{
  instanceId = instanceId || Math.floor(Date.now() / Math.random()).toString(16).substr(0,10)
  WebServer.instances[instanceId] = this

  var app = express()
  applyMiddlewares(app)
  watchControllerChanges(app)
  
  var serverInstance = null
  Object.defineProperties(this, {
    'isLive': {
      get: () => !!serverInstance
    },
    'instanceId': {
      get: () => instanceId
    }
  })
  
  this.startServer = function(port, host)
  {
    if(!app || serverInstance) return
    
    var targetPort = port || WebServer.DEFAULT_PORT
    var targetHost = host || WebServer.DEFAULT_HOST

    // Start server
    serverInstance = app.listen(targetPort, targetHost, function () {
      console.log(`Server instance [${instanceId}] running on http://${targetHost.replace(WebServer.DEFAULT_HOST, 'localhost')}:${targetPort}`)
    })    
  }

  this.stopServer = function()
  {
    if(!app || !serverInstance) return
    // Stop server

    serverInstance.close()
    serverInstance = null
    console.log(`Server instance [${instanceId}] stoped!`)
  }

  this.dispose = function()
  {
    if(!app) return;

    this.stopServer()
    WebServer.instances = WebServer.instances.splice(WebServer.instances.indexOf(instanceId), 1)
    app = undefined;
  }
}
WebServer.DEFAULT_PORT = 3686
WebServer.DEFAULT_HOST = "0.0.0.0"
WebServer.instances = []

module.exports = WebServer