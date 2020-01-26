var Controller = require('../core/controller.js')

var ctrl = module.exports = Controller('/')

// middleware that is specific to this router
ctrl.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

// define the home page route
ctrl.get('/', function(req, res) {
  res.send('Birds home page');
});
// define the about route
ctrl.get('/about', function(req, res) {
  res.send('About birdsddd');
});

/*app.route('/book')
  .get(function(req, res) {
    res.send('Get a random book');
  })
  .post(function(req, res) {
    res.send('Add a book');
  })
  .put(function(req, res) {
    res.send('Update the book');
  });
*/