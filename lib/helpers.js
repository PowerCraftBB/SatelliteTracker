const crypto = require('crypto')
const config = require('./config')
const colors = require('./colors')
const _data = require('./data')
const https = require('https')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const util = require('util')
const debug = util.debuglog('helpers')

var helpers = {}

helpers.parseJsonToObject = function(str) {
	try {
		return JSON.parse(str)
	} catch (e) {
		return {}
	}
}

helpers.hash = function(str) {
	if (str.length > 0) {
		return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex')
	} else {
		return false
	}
}

helpers.createRandomString = function(strLength) {
	strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false
	if (strLength) {
		var possibleCharacters = 'qwertyuiopasdfghjklzxcvbnm0123456789'
		str = ''
		for (let i = 0; i < strLength; i++) str += possibleCharacters.charAt(Math.floor(Math.random() * strLength))
		return str
	} else return false
}

helpers.getSatPositions = (satid, callback) => {
	var requestDetails = {
		'protocol': 'https:',
		'method': 'GET',
		'hostname': 'n2yo.com',
		'path': '/rest/v1/satellite/positions/' + satid + '/0/0/0/' + config.secondsAhead + '?apiKey=' + config.apiKey
	}
	var req = https.request(requestDetails, (res) => {
		var data = ''
		res.on('data', (d) => {
			data += d
		})
		res.on('end', () => {
			data = helpers.parseJsonToObject(data)
			var records = []
			if (typeof(data.positions) == 'object' && data.positions instanceof Array) {
				data.positions.forEach(pos => {
					posObject = {
						'lat': pos.satlatitude,
						'lng': pos.satlongitude
					}
					records.push(posObject)
				})
				callback(records, data.info.satname)
			} else callback(false)
		})
	})

	req.on('error', (e) => {
		debug(colors.ERR, 'Error contacting external API!')
		debug(e + '\n')
	})
	req.end()
}

helpers.getRecordIndex = (records, satid) => {
	for (let i = 0; i < records.length; i++) {
		if (records[i].satid == satid) {
			return i
		}
	}
	return -1
}

helpers.getTemplate = (templateName, data, callback) => {
	templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : false
	if (templateName) {
		var templatesDir = path.join(__dirname, './../templates/')
		fs.readFile(path.join(templatesDir, templateName) + '.html', 'utf8', (err, str) => {
			if (!err && str && str.length > 0) {
				var finalString = helpers.interpolate(str, data)
				callback(false, finalString)
			} else callback('Template not found!')
		})
	} else callback('An invalid template name was specified!')
}

helpers.addUniversalTemplates = (str, data, callback) => {
	str = typeof(str) == 'string' && str.length > 0 ? str : ''
	data = typeof(data) == 'object' && data !== null ? data : {}

	helpers.getTemplate('_header', data, (err, headerString) => {
		if (!err && headerString) {
			helpers.getTemplate('_footer', data, (err, footerString) => {
				if (!err && footerString) {
					var fullString = headerString + str + footerString
					callback(false, fullString)
				} else callback('Could not find the footer template')
			})
		} else callback('Could not find the header template')
	})
}

helpers.interpolate = (str, data) => {
	str = typeof(str) == 'string' && str.length > 0 ? str : ''
	data = typeof(data) == 'object' && data !== null ? data : {}

	for (let keyName in config.templateGlobals) {
		if (config.templateGlobals.hasOwnProperty(keyName)) {
			data['global.' + keyName] = config.templateGlobals[keyName]
		}
	}

	for (let key in data) {
		if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
			var replace = data[key]
			var find = '{' + key + '}'
			str = str.replace(find, replace)
		}
	}

	return str
}

helpers.getStaticAsset = (fileName, callback) => {
	fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false
	if (fileName) {
		var publicDir = path.join(__dirname, './../public/')
		fs.readFile(publicDir + fileName, (err, data) => {
			if (!err && data) callback(false, data)
			else callback('File not found')
		})
	} else callback('A valid file name was not specified')
}

module.exports = helpers