const express = require('express');
var app = express()
var router = express.Router()





router.use(function (req, res, next) {
  if (!req.headers['x-auth']){ 
	  console.log("app")
	  return next('route')
  }
  console.log("app-1")
  next()
})

router.get('/', function (req, res) {
	console.log("/")
  res.json({name: 'hello, user!'})
})

// use the router and 401 anything falling through
app.use('/admin', router, function (req, res) {
	console.log("admin")
  res.status(401).json({name: 'admin'})
})

// mount the router on the app
app.use('/', router)

app.listen(3000)