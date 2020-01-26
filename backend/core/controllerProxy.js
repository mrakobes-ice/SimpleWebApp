var Controller = require('../core/controller.js')

function ControllerProxy(targetPath)
{
  var $this = function(){
    $this.targerController.apply($this.targerController, Array.from(arguments))
  }
  
  $this.sourcePath = targetPath
  $this.targerController = require(targetPath)    
  $this.mountUrl = $this.targerController.mountUrl

  $this.reinitProxy = function(createStub)
  {
    var action = 'updated'
    delete require.cache[require.resolve(targetPath)]
    
    var oldController = $this.targerController
    $this.targerController = require(targetPath)

    if(oldController !== $this.targerController && oldController === Controller.EmptyController)
      action = 'reactivated'

    if($this.mountUrl !== $this.targerController.mountUrl || createStub)
    {
      delete require.cache[require.resolve(targetPath)]
      $this.targerController = Controller.EmptyController // EMPTY CONTROLLER = Stub (костыль, т.к. из express нельзя явно удалить Middleware)
      action = 'deactivated'
    }
    return action
  }
  $this.all = function(){
    $this.targerController.all.apply($this.targerController, Array.from(arguments))
  }
  $this.get = function(){
    $this.targerController.get.apply($this.targerController, Array.from(arguments))
  }
  $this.post = function(){
    $this.targerController.post.apply($this.targerController, Array.from(arguments))
  }
  $this.put = function(){
    $this.targerController.put.apply($this.targerController, Array.from(arguments))
  }
  $this.param = function(){
    $this.targerController.param.apply($this.targerController, Array.from(arguments))
  }
  $this.route = function(){
    $this.targerController.route.apply($this.targerController, Array.from(arguments))
  }
  $this.use = function(){
    $this.targerController.use.apply($this.targerController, Array.from(arguments))
  }

  return $this;
}

module.exports = ControllerProxy