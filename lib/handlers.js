const _data = require('./data')
const helpers = require('./helpers')
const config = require('./config')
const colors = require('./colors')
const util = require('util')
const debug = util.debuglog('handlers')

var handlers = {}

/*
 * HTML Handlers
 */

handlers.index = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Satellite Tracking - Made Simple',
			'head.description': 'We offer free, simple satellite tracking!',
			'body.class': 'index noLogin'
		}

		helpers.getTemplate('index', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.accountCreate = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Create an Account',
			'head.description': 'Sign up is easy an only takes a few seconds',
			'body.class': 'accountCreate noLogin'
		}

		helpers.getTemplate('accountCreate', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.sessionCreate = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Login to tour Account',
			'head.description': 'Please enter your email and password to access your account.',
			'body.class': 'sessionCreate noLogin'
		}

		helpers.getTemplate('sessionCreate', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.sessionDeleted = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Loged Out',
			'head.description': 'You have been logged out of your account.',
			'body.class': 'sessionDeleted noLogin'
		}

		helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.accountEdit = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Account Settings',
			'body.class': 'accountEdit'
		}

		helpers.getTemplate('accountEdit', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.accountDeleted = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Account Deleted',
			'head.description': 'Your account has been deleted.',
			'body.class': 'accountDeleted noLogin'
		}

		helpers.getTemplate('accountDeleted', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.satelliteCategories = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'View Satellite Categories',
			'head.description': 'Browse Satellite Categories.',
			'body.class': 'satelliteCategories'
		}

		helpers.getTemplate('satelliteCategories', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.satellitesCategoryTrack = (data, callback) => {
	if (data.method == 'get') {
		var categoryName = data.trimmedPath.replace('satellites/categories/track/', '')
		if (categoryName.length > 0) {
			var templateData = {
				'head.title': 'View Satellite Category',
				'head.description': 'Track or Untrack satellites',
				'body.class': 'satelliteCategories'
			}

			helpers.getTemplate('satelliteCategories/' + categoryName, templateData, (err, str) => {
				if (!err && str) {
					helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
						if (!err && fullStr) {
							callback(200, fullStr, 'html')
						} else callback(500, undefined, 'html')
					})
				} else callback(500, undefined, 'html')
			})
		} else callback(404, undefined, 'html')
	} else callback(405, undefined, 'html')
}

handlers.satellitesView = (data, callback) => {
	if (data.method == 'get') {
		var templateData = {
			'head.title': 'Dashboard',
			'head.description': 'Watch your tracked satellites',
			'body.class': 'satellitesView'
		}

		helpers.getTemplate('satellitesView', templateData, (err, str) => {
			if (!err && str) {
				helpers.addUniversalTemplates(str, templateData, (err, fullStr) => {
					if (!err && fullStr) {
						callback(200, fullStr, 'html')
					} else callback(500, undefined, 'html')
				})
			} else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.favicon = (data, callback) => {
	if (data.method == 'get') {
		helpers.getStaticAsset('favicon.ico', (err, assetData) => {
			if (!err && assetData) callback(200, assetData, 'favicon')
			else callback(500, undefined, 'html')
		})
	} else callback(405, undefined, 'html')
}

handlers.public = (data, callback) => {
	if (data.method == 'get') {
		var trimmedAssetName = data.trimmedPath.replace('public/', '')
		if (trimmedAssetName.length > 0) {
			helpers.getStaticAsset(trimmedAssetName, (err, assetData) => {
				if (!err && assetData) {
					var contentType = 'plain'
					if (trimmedAssetName.indexOf('.css') > -1) contentType = 'css'
					else if (trimmedAssetName.indexOf('.png') > -1) contentType = 'png'
					else if (trimmedAssetName.indexOf('.jpg') > -1) contentType = 'jpg'
					else if (trimmedAssetName.indexOf('.ico') > -1) contentType = 'favicon'
					callback(200, assetData, contentType)
				} else callback(404, undefined, 'html')
			})
		} else callback(404, undefined, 'html')
	} else callback(405, undefined, 'html')
}

/*
 * JSON API Handlers
 */

handlers.users = function(data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete']
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callback)
	} else callback(405)
}

handlers._users = {}

handlers._users.post = function(data, callback) {
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
	var email = typeof(data.payload.email) == 'string' && /^.+@.+\..+$/.test(data.payload.email.trim()) ? data.payload.email.trim() : false
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
	var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' ? data.payload.tosAgreement : false

	if (firstName && lastName && email && password && tosAgreement) {
		_data.read('users', email, function(err, data) {
			if (err) {
				hashedPassword = helpers.hash(password)

				if (hashedPassword) {
					userObject = {
						'firstName': firstName,
						'lastName': lastName,
						'email': email,
						'hashedPassword': hashedPassword,
						'tosAgreement': tosAgreement
					}

					_data.create('users', email, userObject, function(err) {
						if (!err) {
							callback(200)
						} else {
							callback(500, {
								'Error': 'Error creating new user!'
							})
						}
					})
				} else {
					callback(500, {
						'Error': 'Error hashing password!'
					})
				}
			} else {
				callback(400, {
					'Error': 'User already exists!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._users.get = function(data, callback) {
	var email = typeof(data.queryStringObject.email) == 'string' && /^.+@.+\..+$/.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false
	if (email) {
		var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == config.tokenLength ? data.headers.token : false
		handlers._tokens.verify(token, email, function(tokenIsValid) {
			if (tokenIsValid) {
				_data.read('users', email, function(err, userData) {
					if (!err && userData) {
						delete userData.hashedPassword
						callback(200, userData)
					} else {
						callback(400, {
							'Error': 'User not found!'
						});
					}
				})
			} else {
				callback(403, {
					'Error': 'Missing required token in header, or token is invalid!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._users.put = function(data, callback) {
	var email = typeof(data.payload.email) == 'string' && /^.+@.+\..+$/.test(data.payload.email.trim()) ? data.payload.email.trim() : false
	var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false
	var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false
	if (email && (firstName || lastName || password)) {
		var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == config.tokenLength ? data.headers.token : false
		handlers._tokens.verify(token, email, function(tokenIsValid) {
			if (tokenIsValid) {
				_data.read('users', email, function(err, userData) {
					if (!err && userData) {
						userData.firstName = firstName ? firstName : userData.firstName
						userData.lastName = lastName ? lastName : userData.lastName
						userData.hashedPassword = password ? helpers.hash(password) : userData.hashedPassword

						_data.update('users', email, userData, function(err) {
							if (!err) {
								callback(200)
							} else {
								callback(500, {
									'Error': 'Could not update user!'
								})
							}
						})
					} else {
						callback(400, {
							'Error': 'User not found!'
						})
					}
				})
			} else {
				callback(403, {
					'Error': 'Missing required token in header, or token is invalid!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._users.delete = function(data, callback) {
	var email = typeof(data.queryStringObject.email) == 'string' && /^.+@.+\..+$/.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false
	if (email) {
		var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == config.tokenLength ? data.headers.token : false
		handlers._tokens.verify(token, email, function(tokenIsValid) {
			if (tokenIsValid) {
				_data.read('users', email, function(err, userData) {
					if (!err && userData) {
						_data.delete('users', email, function(err) {
							if (!err) {
								callback(200)
							} else {
								callback(500, {
									'Error': 'Could not delete user!'
								})
							}
						})
					} else {
						callback(400, {
							'Error': 'User not found!'
						})
					}
				})
			} else {
				callback(403, {
					'Error': 'Missing required token in header, or token is invalid!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers.tokens = function(data, callback) {
	var acceptableMethods = ['post', 'get', 'put', 'delete']
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._tokens[data.method](data, callback)
	} else callback(405)
}

handlers._tokens = {}

handlers._tokens.post = function(data, callback) {
	var email = typeof(data.payload.email) == 'string' && /^.+@.+\..+$/.test(data.payload.email.trim()) ? data.payload.email.trim() : false
	var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false

	if (email && password) {
		_data.read('users', email, function(err, userData) {
			if (!err && userData) {
				hashedPassword = helpers.hash(password)
				if (hashedPassword) {
					if (hashedPassword == userData.hashedPassword) {
						var tokenId = helpers.createRandomString(config.tokenLength)
						var expires = Date.now() + 1000 * 60 * 60
						var tokenObject = {
							'email': userData.email,
							'id': tokenId,
							'expires': expires
						}

						_data.create('tokens', tokenId, tokenObject, function(err) {
							if (!err) callback(200, tokenObject)
							else {
								callback(500, {
									'Error': 'Could not create new token!'
								})
							}
						})
					} else {
						callback(400, {
							'Error': 'Wrong password!'
						})
					}
				} else {
					callback(500, {
						'Error': 'Error hashing password!'
					})
				}
			} else {
				callback(400, {
					'Error': 'User not found!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._tokens.get = function(data, callback) {
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == config.tokenLength ? data.queryStringObject.id.trim() : false
	if (id) {
		_data.read('tokens', id, function(err, tokenData) {
			if (!err && tokenData) {
				callback(200, tokenData)
			} else {
				callback(400, {
					'Error': 'Token not found!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._tokens.put = function(data, callback) {
	var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == config.tokenLength ? data.payload.id.trim() : false
	if (id) {
		_data.read('tokens', id, function(err, tokenData) {
			if (!err && tokenData) {
				if (tokenData.expires > Date.now()) {
					tokenData.expires = Date.now() + 1000 * 60 * 60
					_data.update('tokens', id, tokenData, function(err) {
						if (!err) {
							callback(200)
						} else {
							callback(500, {
								'Error': 'Could not update the token!'
							})
						}
					})
				} else {
					callback(400, {
						'Error': 'Token has already expired!'
					})
				}
			} else {
				callback(400, {
					'Error': 'Token not found!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._tokens.delete = function(data, callback) {
	var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == config.tokenLength ? data.queryStringObject.id.trim() : false
	if (id) {
		_data.read('tokens', id, function(err, data) {
			if (!err && data) {
				_data.delete('tokens', id, function(err) {
					if (!err) callback(200)
					else {
						callback(400, {
							'Error': 'Could not delete the token!'
						})
					}
				})
			} else {
				callback(400, {
					'Error': 'Token not found!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._tokens.verify = function(token, email, callback) {
	_data.read('tokens', token, function(err, tokenData) {
		if (!err && tokenData) {
			if (email == tokenData.email && tokenData.expires > Date.now()) callback(true)
			else callback(false)
		} else callback(false)
	})
}

handlers.satellites = function(data, callback) {
	var acceptableMethods = ['post', 'get', 'delete']
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._satellites[data.method](data, callback)
	} else callback(405)
}

handlers._satellites = {}

handlers._satellites.post = function(data, callback) {
	var email = typeof(data.payload.email) == 'string' && /^.+@.+\..+$/.test(data.payload.email.trim()) ? data.payload.email.trim() : false
	var satid = typeof(data.payload.satid) == 'string' ? data.payload.satid : false
	if (email && satid) {
		var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == config.tokenLength ? data.headers.token : false
		handlers._tokens.verify(token, email, function(tokenIsValid) {
			if (tokenIsValid) {
				_data.read('users', email, (err, userData) => {
					if (!err && userData) {
						var tracking = typeof(userData.tracking) == 'object' && userData.tracking instanceof Array ? userData.tracking : []
						tracking.push(satid)
						userData.tracking = tracking
						_data.update('users', email, userData, function(err) {
							if (!err) {
								callback(200)
							} else {
								callback(400, {
									'Error': 'Could not update user with new satellite data!'
								})
							}
						})
					} else {
						callback(400, {
							'Error': 'User not found!'
						})
					}
				})
			} else {
				callback(403, {
					'Error': 'Missing required token in header, or token is invalid!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._satellites.get = function(data, callback) {
	var email = typeof(data.queryStringObject.email) == 'string' && /^.+@.+\..+$/.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false
	if (email) {
		var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == config.tokenLength ? data.headers.token : false
		handlers._tokens.verify(token, email, function(tokenIsValid) {
			if (tokenIsValid) {
				_data.read('users', email, (err, userData) => {
					if (!err && userData) {
						var trackedIDs = typeof(userData.tracking) == 'object' && userData.tracking instanceof Array ? userData.tracking : []
						_data.list('satellites', (err, savedSatids) => {
							if (!err && savedSatids) {
								var payload = {}

								var promises = []
								trackedIDs.forEach(trackedID => {
									promises.push(handlers._satellites.getReturnPayloadPart(trackedID))
								})

								Promise.all(promises)
									.then(positions => {
										positions.forEach(pos => {
											if (typeof(pos) == 'object') {
												satid = pos.satid
												delete pos.satid
												payload[satid] = pos
											} else debug(pos)
										})
										if (Object.keys(payload).length > 0 || trackedIDs.length == 0) callback(200, payload)
										else callback(500, payload)
									})
									.catch(err => {
										console.log(err)
										callback(500)
									})
							} else {
								callback(500, {
									'Error': 'Error listing satellite ids!'
								})
							}
						})
					} else {
						callback(400, {
							'Error': 'User not found!'
						})
					}
				})
			} else {
				callback(403, {
					'Error': 'Missing required token in header, or token is invalid!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers._satellites.delete = function(data, callback) {
	var email = typeof(data.queryStringObject.email) == 'string' && /^.+@.+\..+$/.test(data.queryStringObject.email.trim()) ? data.queryStringObject.email.trim() : false
	var satid = typeof(data.queryStringObject.satid) == 'string' ? data.queryStringObject.satid : false
	if (email && satid) {
		var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length == config.tokenLength ? data.headers.token : false
		handlers._tokens.verify(token, email, function(tokenIsValid) {
			if (tokenIsValid) {
				_data.read('users', email, function(err, userData) {
					if (!err && userData) {
						var tracking = typeof(userData.tracking) == 'object' && userData.tracking instanceof Array ? userData.tracking : []
						var trackingIndex = tracking.indexOf(satid)
						if (trackingIndex > -1) {
							tracking.splice(trackingIndex, 1)
							userData.tracking = tracking
							_data.update('users', email, userData, (err) => {
								if (!err) {
									callback(200)
								} else {
									callback(500, {
										'Error': 'Could not update user!'
									});
								}
							})
						} else {
							callback(400, {
								'Error': 'Satellite was not tracked!'
							});
						}
					} else {
						callback(400, {
							'Error': 'User not found!'
						});
					}
				})
			} else {
				callback(403, {
					'Error': 'Missing required token in header, or token is invalid!'
				})
			}
		})
	} else {
		callback(400, {
			'Error': 'Missing required fields!'
		})
	}
}

handlers.getHomeSatellite = (data, callback) => {
	if (data.method = 'get') {
		handlers._satellites.getNewSatdataIfNeeded(config.homeSatid, (err) => {
			if (!err) {
				handlers._satellites.updateSatdataIfExpired(config.homeSatid, (err) => {
					if (!err) {
						_data.read('satellites', config.homeSatid, (err, satData) => {
							if (!err && satData) callback(200, satData)
							else {
								callback(500, {
									'Error': 'Could not read satellite data!'
								})
							}
						})
					} else {
						callback(500, {
							'Error': 'Could not update satellite data!'
						})
					}
				})
			} else {
				callback(500, {
					'Error': 'Could not get new satellite data!'
				})
			}
		})
	} else {
		callback(405, {
			'Error': 'Method not supported!'
		})
	}
}

handlers._satellites.getNewSatdataIfNeeded = (satid, callback) => {
	_data.list('satellites', (err, savedSatids) => {
		if (!err && savedSatids) {
			if (savedSatids.length <= 83) {
				if (savedSatids.indexOf(satid) > -1) {
					callback(false)
				} else {
					helpers.getSatPositions(satid, (output, satname) => {
						if (output && satname) {
							var satData = {
								'timeTaken': Date.now(),
								'satname': satname,
								'records': output
							}
							_data.create('satellites', satid, satData, (err) => {
								if (!err) callback(false)
								else callback('Error creating new satellite data file')
							})
						} else callback('Bad data from external API!')
					})
				}
			} else {
				console.log(colors.ERR, '!!! FATAL ERROR: Can\'t track more satellites with this API key !!!');
			}
		} else callback('Error listing satellite file names')
	})
}

handlers._satellites.updateSatdataIfExpired = (satid, callback) => {
	_data.read('satellites', satid, (err, satData) => {
		if (!err && satData) {
			if (satData.timeTaken + config.secondsAhead * 1000 > Date.now()) {
				callback(false)
			} else {
				helpers.getSatPositions(satid, (output, satname) => {
					var satData = {
						'timeTaken': Date.now(),
						'satname': satname,
						'records': output
					}
					_data.update('satellites', satid, satData, (err) => {
						if (!err) callback(false)
						else callback('Error creating new satellite data file')
					})
				})
			}
		} else callback('Error listing satellite file names')
	})
}

handlers._satellites.getReturnPayloadPart = (satid) => {
	return new Promise((resolve, reject) => {
		handlers._satellites.getNewSatdataIfNeeded(satid, (err) => {
			if (!err) {
				handlers._satellites.updateSatdataIfExpired(satid, (err) => {
					if (!err) {
						_data.read('satellites', satid, (err, satData) => {
							if (!err && satData) {
								satData.satid = satid
								resolve(satData)
							} else resolve('Could not read satellite data!')
						})
					} else resolve('Could not update satellite data!')
				})
			} else resolve('Could not get new satellite data!')
		})
	})
}

handlers.ping = function(data, callback) {
	callback(200)
}

handlers.notFound = function(data, callback) {
	callback(404)
}

module.exports = handlers