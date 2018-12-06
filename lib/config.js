var enviroments = {}

enviroments.staging = {
	'httpPort': 3000,
	'envName': 'staging',
	'hashingSecret': 'xxxxxxxxxxxxxxxx',
	'tokenLength': 10,
	'secondsAhead': 300,
	'apiKey': 'xxxxxx-xxxxxx-xxxxxx-xxxx',
	'homeSatid': '25544',
	'templateGlobals': {
		'appName': 'SatelliteTracker',
		'companyName': 'MAJAST',
		'yearCreated': '2018',
		'baseUrl': 'http://192.168.1.12:3000/' 
	}
}

enviroments.production = {
	'httpPort': 5000,
	'envName': 'production',
	'hashingSecret': 'xxxxxxxxxxxxxxxx',
	'tokenLength': 20,
	'secondsAhead': 300,
	'apiKey': 'xxxxxx-xxxxxx-xxxxxx-xxxx',
	'homeSatid': '25544',
	'templateGlobals': {
		'appName': 'SatelliteTracker',
		'companyName': 'MAJAST',
		'yearCreated': '2018',
		'baseUrl': 'http://185.122.53.84:5000/'
	}
}

var currentEnviroment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''
var enviromentToExport = typeof(enviroments[currentEnviroment]) == 'object' ? enviroments[currentEnviroment] : enviroments.staging
module.exports = enviromentToExport
