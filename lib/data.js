const fs = require('fs')
const path = require('path')
const helpers = require('./helpers')

var lib = {}

const baseDir = path.join(__dirname + './../.data/')

lib.create = function(dir, file, data, callback) {
	fs.open(baseDir + dir + '/' + file + '.json', 'wx', function(err, fileDescriptor) {
		if (!err && fileDescriptor) {
			stringData = JSON.stringify(data)

			fs.writeFile(fileDescriptor, stringData, function(err) {
				if (!err) {
					fs.close(fileDescriptor, function(err) {
						if (!err) callback(false)
						else callback('Error closing the new file!')
					})
				} else callback('Error writing to a new file!')
			})
		} else callback('Could not create new file, it may already exist!')
	})
}

lib.read = function(dir, file, callback) {
	fs.readFile(baseDir + dir + '/' + file + '.json', 'utf-8', function(err, data) {
		if (!err && data) {
			var parsedData = helpers.parseJsonToObject(data)
			callback(false, parsedData)
		} else {
			callback(err, data)
		}
	})
}

lib.update = function(dir, file, data, callback) {
	fs.open(baseDir + dir + '/' + file + '.json', 'r+', function(err, fileDescriptor) {
		if (!err, fileDescriptor) {
			fs.truncate(fileDescriptor, function(err) {
				if (!err) {
					stringData = JSON.stringify(data)
					fs.write(fileDescriptor, stringData, function(err) {
						if (!err) {
							fs.close(fileDescriptor, function(err) {
								if (!err) callback(false)
								else callback('Error closing the new file!')
							})
						} else callback('Error writing to file!')
					})
				} else callback('Error truncating the file!')
			})
		} else callback('Could not open the file for updating, it may not exist yet!')
	})
}

lib.delete = function(dir, file, callback) {
	fs.unlink(baseDir + dir + '/' + file + '.json', function(err) {
		if (!err) callback(false)
		else callback('Error deleting the file!')
	})
}

lib.list = function(dir, callback) {
	fs.readdir(baseDir + dir, function(err, data) {
		if (!err && data) {
			var trimmedFileNames = []
			data.forEach(function(fileName) {
				trimmedFileNames.push(fileName.replace('.json', ''))
			})
			callback(false, trimmedFileNames)
		} else callback(err, data)
	})
}

module.exports = lib