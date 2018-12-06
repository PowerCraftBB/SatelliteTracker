const _data = require('./data')
const helpers = require('./helpers')
const config = require('./config')
const colors = require('./colors')
const spawn = require("child_process").spawn
const util = require('util');
const debug = util.debuglog('workers')

const StringDecoder = require('string_decoder').StringDecoder

var workers = {}



var clearUntrackedSatellites = () => {
	_data.list('satellites', (err, satids) => {
		if (!err && satids) {
			satids.forEach(satid => {
				if (satid == config.homeSatid) return
				_data.read('satellites', satid, (err, satData) => {
					if (!err && satData) {
						if (satData.timeTaken + 1000 * 60 * 10 < Date.now()) {
							_data.delete('satellites', satid, err => {
								if (!err) debug(colors.OK, 'Satellite ' + satid + ' deleted!')
								else debug(colors.ERR, 'Unable to delete satellite: ' + satid)
							})
						} else debug('Satellite ' + satid + ' is still being tracked!')
					} else debug(colors.ERR, 'Could not read: ' + satid)
				})
			})
		} else debug(colors.ERR, 'Could not list satellites!')
	})
}

var clearUntrackedLoop = function() {
	clearUntrackedSatellites()
	setInterval(clearUntrackedSatellites, 1000 * 60 * 10)
}

var tableScraper = () => {
	const pythonScraper = spawn('python', [__dirname + '/tableScraper.py'])
	var output = ''

	var decoder = new StringDecoder('utf8')

	pythonScraper.stdout.on('data', (data) => {
		output += decoder.write(data)
	})

	pythonScraper.stderr.on('data', (data) => {
		output += decoder.write(data)
	})

	pythonScraper.on('close', (code) => {
		debug(colors.OK, output.replace('\n', ''))
		if (code != 0) debug(colors.ERR, 'Child process exited with code ' + code)
	})

	pythonScraper.on('error', (e) => {
		debug(colors.ERR, 'Failed to start Table Scraper!')
	})
}

var tableScraperLoop = () => {
	tableScraper()
	setInterval(tableScraper, 1000 * 60 * 60 * 2)
}

var getHomeSatellite = () => {
	helpers.getSatPositions(config.homeSatid, (output, satname) => {
		var satData = {
			'timeTaken': Date.now(),
			'satname': satname,
			'records': output
		}
		_data.read('satellites', config.homeSatid, (err, data) => {
			if (!err) {
				_data.update('satellites', config.homeSatid, satData, (err) => {
					if (!err) debug(colors.OK, 'Home satellite\'s possition updated!')
					else debug(colors.ERR, 'Error updating satellite data file for home satellite')
				})
			} else {
				_data.create('satellites', config.homeSatid, satData, (err) => {
					if (!err) debug(colors.OK, 'Home satellite\'s possition updated!')
					else debug(colors.ERR, 'Error creating new satellite data file for home satellite')
				})
			}
		})
	})
}

var homeSatelliteLoop = () => {
	getHomeSatellite()
	setInterval(getHomeSatellite, 1000 * 60 * 4)
}

var cleanUpTokens = function() {
	_data.list('tokens', function(err, tokenIds) {
		if (!err && tokenIds) {
			tokenIds.forEach(function(tokenId) {
				_data.read('tokens', tokenId, function(err, tokenData) {
					if (!err && tokenData) {
						if (tokenData.expires < Date.now()) {
							_data.delete('tokens', tokenId, function(err) {
								if (!err) debug(colors.OK, 'Token deleted! (' + tokenId + ')')
								else debug(colors.ERR, 'Could not delete token (' + tokenId + ')')
							})
						} else debug(colors.OK, 'Token is valid (' + tokenId + ')')
					} else debug(colors.ERR, 'Token not found! (' + tokenId + ')')
				})
			})
		} else debug(colors.ERR, 'Could not list tokens!')
	})
}

var cleanUpLoop = function() {
	cleanUpTokens()
	setInterval(cleanUpTokens, 1000 * 60 * 60)
}

workers.init = function() {
	cleanUpLoop()
	homeSatelliteLoop()
	tableScraperLoop()
	clearUntrackedLoop()
}

module.exports = workers
