const http = require('http')
const config = require('./config')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder
const handlers = require('./handlers')
const helpers = require('./helpers')
const util = require('util')
const debug = util.debuglog('server')
const colors = require('./colors')

server = {};

server.httpServer = http.createServer(function(req, res) {
	parsedUrl = url.parse(req.url, true)
	path = parsedUrl.pathname
	trimmedPath = path.replace(/^\/+|\/+$/g, '')
	method = req.method.toLowerCase()
	queryStringObject = parsedUrl.query
	headers = req.headers

	var decoder = new StringDecoder('utf-8')
	var buffer = ''
	req.on('data', function(data) {
		buffer += decoder.write(data)
	})
	req.on('end', function() {
		buffer += decoder.end()

		var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound

		chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler
		chosenHandler = trimmedPath.indexOf('satellites/categories/track') > -1 ? handlers.satellitesCategoryTrack : chosenHandler

		var data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'headers': headers,
			'payload': helpers.parseJsonToObject(buffer)
		}

		chosenHandler(data, function(statusCode, payload, contentType) {
			contentType = typeof(contentType) == 'string' ? contentType : 'json'
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200

			var payloadString = ''
			if (contentType == 'json') {
				res.setHeader('Content-Type', 'application/json')
				payload = typeof(payload) == 'object' ? payload : {}
				payloadString = JSON.stringify(payload)
			} else if (contentType == 'html') {
				res.setHeader('Content-Type', 'text/html')
				payloadString = typeof(payload) == 'string' ? payload : ''
			} else if (contentType == 'favicon') {
				res.setHeader('Content-Type', 'image/x-icon')
				payloadString = typeof(payload) !== 'undefined' ? payload : ''
			} else if (contentType == 'css') {
				res.setHeader('Content-Type', 'text/css')
				payloadString = typeof(payload) !== 'undefined' ? payload : ''
			} else if (contentType == 'png') {
				res.setHeader('Content-Type', 'image/png')
				payloadString = typeof(payload) !== 'undefined' ? payload : ''
			} else if (contentType == 'jpg') {
				res.setHeader('Content-Type', 'image/jpeg')
				payloadString = typeof(payload) !== 'undefined' ? payload : ''
			} else if (contentType == 'plain') {
				res.setHeader('Content-Type', 'text/plain')
				payloadString = typeof(payload) !== 'undefined' ? payload : ''
			}


			res.writeHead(statusCode)
			res.end(payloadString)

			clr = colors.BAD
			if (statusCode == 200) clr = colors.OK
			debug(clr, method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode)
		})
	})
})

server.router = {
	'': handlers.index,
	'account/create': handlers.accountCreate,
	'account/edit': handlers.accountEdit,
	'account/deleted': handlers.accountDeleted,
	'session/create': handlers.sessionCreate,
	'session/deleted': handlers.sessionDeleted,
	'satellites/categories': handlers.satelliteCategories,
	'satellites/categories/track': handlers.satellitesCategoryTrack,
	'satellites/view': handlers.satellitesView,
	'getHomeSatellite': handlers.getHomeSatellite,
	'ping': handlers.ping,
	'api/users': handlers.users,
	'api/tokens': handlers.tokens,
	'api/satellites': handlers.satellites,
	'favicon.ico': handlers.favicon,
	'public': handlers.public
}

server.init = () => {
	server.httpServer.listen(config.httpPort, () => {
		console.log(colors.SERVER, 'The HTTP server is running on port ' + config.httpPort)
	})
}

module.exports = server