/*
 * Frontend Logic for application
 *
 */

// Container for frontend application
var app = {}

// Config
app.config = {
	'sessionToken': false,
	'canLogOut': false
}

app.data = {
	'satellites': {},
	'homeSatellite': {}
}

// AJAX Client (for RESTful API)
app.client = {}

// Interface for making API calls
app.client.request = (headers, path, method, queryStringObject, payload, callback) => {

	// Set defaults
	headers = typeof(headers) == 'object' && headers !== null ? headers : {}
	path = typeof(path) == 'string' ? path : '/'
	method = typeof(method) == 'string' && ['POST', 'GET', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method.toUpperCase() : 'GET'
	queryStringObject = typeof(queryStringObject) == 'object' && queryStringObject !== null ? queryStringObject : {}
	payload = typeof(payload) == 'object' && payload !== null ? payload : {}
	callback = typeof(callback) == 'function' ? callback : false

	// For each query string parameter sent, add it to the path
	var requestUrl = path + '?'
	var counter = 0
	for (let queryKey in queryStringObject) {
		if (queryStringObject.hasOwnProperty(queryKey)) {
			counter++;
			// If at least one query string parameter has already been added, preprend new ones with an ampersand
			if (counter > 1) requestUrl += '&'
			// Add the key and value
			requestUrl += queryKey + '=' + queryStringObject[queryKey]
		}
	}

	// Form the http request as a JSON type
	var xhr = new XMLHttpRequest();
	xhr.open(method, requestUrl, true)
	xhr.setRequestHeader("Content-type", "application/json")

	// For each header sent, add it to the request
	for (var headerKey in headers) {
		if (headers.hasOwnProperty(headerKey)) xhr.setRequestHeader(headerKey, headers[headerKey])
	}

	// If there is a current session token set, add that as a header
	if (app.config.sessionToken) xhr.setRequestHeader("token", app.config.sessionToken.id)

	// When the request comes back, handle the response
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			var statusCode = xhr.status
			var responseReturned = xhr.responseText

			// Callback if requested
			if (callback) {
				try {
					var parsedResponse = JSON.parse(responseReturned)
					callback(statusCode, parsedResponse)
				} catch (e) {
					callback(statusCode, false)
				}

			}
		}
	}

	// Send the payload as JSON
	var payloadString = JSON.stringify(payload)
	xhr.send(payloadString)

}

// Bind the logout button
app.bindLogoutButton = () => {
	document.getElementById("logoutButton").addEventListener("click", (e) => {
		// Stop it from redirecting anywhere
		e.preventDefault()

		// Log the user out
		app.logUserOut()
	})
}

// Bind satellite track/untrack buttons
app.bindTrackButtons = (userTrackingIDs) => {
	buttons = document.getElementsByTagName("button")

	for (let i = 0; i < buttons.length; i++) {
		var btn = buttons[i]

		if (userTrackingIDs.indexOf(btn.id) > -1) {
			btn.textContent = "UNTRACK IT"
		}

		btn.addEventListener("click", (e) => {
			// Stop it from redirecting anywhere
			e.preventDefault()

			btn = e.target
			if (btn.textContent == 'TRACK IT') {
				var payload = {
					'email': app.config.sessionToken.email,
					'satid': String(btn.id)
				}

				app.client.request(undefined, 'api/satellites', 'POST', undefined, payload, (statusCode, responsePayload) => {
					if (statusCode == 200) {
						btn.textContent = 'UNTRACK IT'
					}
				})
			} else if (btn.textContent == 'UNTRACK IT') {
				var queryStringObject = {
					'email': app.config.sessionToken.email,
					'satid': btn.id
				}

				app.client.request(undefined, 'api/satellites', 'DELETE', queryStringObject, undefined, (statusCode, responsePayload) => {
					if (statusCode == 200) {
						btn.textContent = 'TRACK IT'
					}
				})
			} else console.log('Error');
		})
	}
}

// Log the user out then redirect them
app.logUserOut = (redirectUser) => {
	if (!app.config.canLogOut) return true
	// Set redirectUser to default to true
	redirectUser = typeof(redirectUser) == 'boolean' ? redirectUser : true

	// Get the current token id
	var tokenId = typeof(app.config.sessionToken.id) == 'string' ? app.config.sessionToken.id : false
	if (tokenId) {
		// Send the current token to the tokens endpoint and delete it
		var queryStringObject = {
			'id': tokenId
		}
		app.client.request(undefined, 'api/tokens', 'DELETE', queryStringObject, undefined, (statusCode, payload) => {

			// Set the app.config token as false
			app.setSessionToken(false)

			if (redirectUser) {
				// Send the user to the logged out page
				window.location = '/session/deleted'
			}
		})
	} else if (document.getElementsByClassName('noLogin').length == 0) window.location = '/session/deleted'
}

// Bind the forms
app.bindForms = () => {
	if (document.querySelector("form")) {

		var allForms = document.querySelectorAll("form")
		for (let i = 0; i < allForms.length; i++) {
			//                                   Can't use ES6
			allForms[i].addEventListener("submit", function(e) {

				// Stop it from submitting
				e.preventDefault();
				var formId = this.id
				var path = this.action
				var method = this.method.toUpperCase()

				// Hide the error message (if it's currently shown due to a previous error)
				document.querySelector("#" + formId + " .formError").style.display = 'none'

				// Hide the success message (if it's currently shown due to a previous success)
				if (document.querySelector("#" + formId + " .formSuccess")) {
					document.querySelector("#" + formId + " .formSuccess").style.display = 'none'
				}

				// Turn the inputs into a payload
				var payload = {}
				var elements = this.elements
				for (let i = 0; i < elements.length; i++) {
					if (elements[i].type !== 'submit') {
						var valueOfElement = elements[i].type == 'checkbox' ? elements[i].checked : elements[i].value
						if (elements[i].name == '_method') method = valueOfElement
						else payload[elements[i].name] = valueOfElement
					}
				}

				// If the method is DELETE, the payload should be a queryStringObject instead
				var queryStringObject = method == 'DELETE' ? payload : {}

				// Call the API
				app.client.request(undefined, path, method, queryStringObject, payload, function(statusCode, responsePayload) {
					// Display an error on the form if needed
					if (statusCode !== 200) {

						if (statusCode == 403) app.logUserOut()
						else {
							// Try to get the error from the api, or set a default error message
							var error = typeof(responsePayload.Error) == 'string' ? responsePayload.Error : 'An error has occured, please try again'

							// Set the formError field with the error text
							document.querySelector("#" + formId + " .formError").innerHTML = error

							// Show (unhide) the form error field on the form
							document.querySelector("#" + formId + " .formError").style.display = 'block'
						}
					} else {
						// If successful, send to form response processor
						app.formResponseProcessor(formId, payload, responsePayload)
					}
				})
			})
		}
	}
}

// Form response processor
app.formResponseProcessor = (formId, requestPayload, responsePayload) => {
	var functionToCall = false;
	// If account creation was successful, try to immediately log the user in
	if (formId == 'accountCreate') {
		// Take the email and password, and use it to log the user in
		var newPayload = {
			'email': requestPayload.email,
			'password': requestPayload.password
		}

		app.client.request(undefined, 'api/tokens', 'POST', undefined, newPayload, function(newStatusCode, newResponsePayload) {
			// Display an error on the form if needed
			if (newStatusCode !== 200) {

				// Set the formError field with the error text
				document.querySelector("#" + formId + " .formError").innerHTML = 'Sorry, an error has occured. Please try again.'

				// Show (unhide) the form error field on the form
				document.querySelector("#" + formId + " .formError").style.display = 'block'

			} else {
				// If successful, set the token and redirect the user
				app.setSessionToken(newResponsePayload)
				window.location = '/satellites/view'
			}
		})
	}
	// If login was successful, set the token in localstorage and redirect the user
	if (formId == 'sessionCreate') {
		app.setSessionToken(responsePayload)
		window.location = '/satellites/view'
	}

	// If forms saved successfully and they have success messages, show them
	var formsWithSuccessMessages = ['accountEdit1', 'accountEdit2'];
	if (formsWithSuccessMessages.indexOf(formId) > -1) {
		document.querySelector("#" + formId + " .formSuccess").style.display = 'block';
	}

	// If the user just deleted their account, redirect them to the account-delete page
	if (formId == 'accountEdit3') {
		app.logUserOut(false)
		window.location = '/account/deleted'
	}
}

// Get the session token from localstorage and set it in the app.config object
app.getSessionToken = () => {
	var tokenString = localStorage.getItem('token')
	if (typeof(tokenString) == 'string') {
		try {
			var token = JSON.parse(tokenString)
			app.config.sessionToken = token
			if (typeof(token) == 'object') {
				app.setLoggedInClass(true)
			} else {
				app.setLoggedInClass(false)
			}
		} catch (e) {
			app.config.sessionToken = false
			app.setLoggedInClass(false)
		}
	}
}

// Set (or remove) the loggedIn class from the body
app.setLoggedInClass = (add) => {
	var target = document.querySelector("body")
	if (add) {
		target.classList.add('loggedIn')
	} else {
		target.classList.remove('loggedIn')
	}
}

// Set the session token in the app.config object as well as localstorage
app.setSessionToken = (token) => {
	app.config.sessionToken = token
	var tokenString = JSON.stringify(token)
	localStorage.setItem('token', tokenString)
	if (typeof(token) == 'object') {
		app.setLoggedInClass(true)
	} else {
		app.setLoggedInClass(false)
	}
}

// Renew the token
app.renewToken = (callback) => {
	var currentToken = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false
	if (currentToken) {
		// Update the token with a new expiration
		var payload = {
			'id': currentToken.id,
			'extend': true
		}
		app.client.request(undefined, 'api/tokens', 'PUT', undefined, payload, function(statusCode, responsePayload) {
			// Display an error on the form if needed
			if (statusCode == 200) {
				// Get the new token details
				var queryStringObject = {
					'id': currentToken.id
				}
				app.client.request(undefined, 'api/tokens', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
					// Display an error on the form if needed
					if (statusCode == 200) {
						app.setSessionToken(responsePayload)
						app.config.canLogOut = true
						callback(false)
					} else {
						app.setSessionToken(false)
						callback(true)
					}
				})
			} else {
				app.setSessionToken(false)
				callback(true)
			}
		})
	} else {
		app.setSessionToken(false)
		var bodyClasses = document.getElementsByTagName('body')[0].classList.toString()
		if (bodyClasses.indexOf('noLogin') == -1) app.logUserOut()
		callback(true)
	}
}

// Actualize map
app.actualizeMap = (callback) => {
	var token = typeof(app.config.sessionToken) == 'object' ? app.config.sessionToken : false
	if (token) {
		// Update the token with a new expiration
		var queryStringObject = {
			'id': token.id,
			'email': token.email
		}
		app.client.request(undefined, 'api/satellites', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {

			if (statusCode == 200) {
				app.data.satellites = responsePayload
				callback(false)
			} else {
				app.logUserOut(err => {
					if (err) app.actualizeMap(e => {
						callback(e)
					})
				})
				callback(true)
			}
		})
	} else {
		app.setSessionToken(false)
		app.logUserOut()
		callback(true)
	}
}

// Actualize home map
app.actualizeHomeMap = (callback) => {
	app.client.request(undefined, 'getHomeSatellite', 'GET', undefined, undefined, function(statusCode, responsePayload) {
		if (statusCode == 200) {
			app.data.homeSatellite = responsePayload
			callback(false)
		} else callback(true)
	})
}

// Load data on the page
app.loadDataOnPage = function() {
	// Get the current page from the body class
	var bodyClasses = document.querySelector("body").classList
	var primaryClass = typeof(bodyClasses[0]) == 'string' ? bodyClasses[0] : false

	// Load correct page
	if (primaryClass == 'accountEdit') {
		app.loadAccountEditPage()
	} else if (primaryClass == 'satelliteCategories') {
		app.loadSatellitresTrackPage()
	} else if (primaryClass == 'satellitesView') {
		app.loadSatellitesViewPage()
	} else if (primaryClass == 'index') {
		app.loadIndexPage()
	}
}

// Load the account edit page specifically
app.loadAccountEditPage = () => {
	// Get the email from the current token, or log the user out if none is there
	var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false
	if (email) {
		// Fetch the user data
		var queryStringObject = {
			'email': email
		}
		app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
			if (statusCode == 200) {
				// Put the data into the forms as values where needed
				document.querySelector("#accountEdit1 .firstNameInput").value = responsePayload.firstName
				document.querySelector("#accountEdit1 .lastNameInput").value = responsePayload.lastName
				document.querySelector("#accountEdit1 .displayEmailInput").value = responsePayload.email

				// Put the hidden email field into both forms
				var hiddenEmailInputs = document.querySelectorAll("input.hiddenEmailInput")
				for (let i = 0; i < hiddenEmailInputs.length; i++) {
					hiddenEmailInputs[i].value = responsePayload.email
				}
			} else {
				// If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
				app.logUserOut()
			}
		})
	} else app.logUserOut()
}

// Load the satellites track page specifically
app.loadSatellitresTrackPage = () => {
	// Get the email from the current token, or log the user out if none is there
	var email = typeof(app.config.sessionToken.email) == 'string' ? app.config.sessionToken.email : false
	if (email) {
		// Fetch the user data
		var queryStringObject = {
			'email': email
		}
		app.client.request(undefined, 'api/users', 'GET', queryStringObject, undefined, function(statusCode, responsePayload) {
			if (statusCode == 200) {
				var userTrackingIDs = typeof(responsePayload.tracking) == 'object' && responsePayload.tracking instanceof Array ? responsePayload.tracking : []
				app.bindTrackButtons(userTrackingIDs)
			} else {
				// If the request comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
				app.logUserOut()
			}
		})
	} else app.logUserOut()
}

app.loadSatellitesViewPage = () => {
	app.mapActualizeLoop()
}

app.loadIndexPage = () => {
	app.homeMapActualizeLoop()

}

// Loop to renew token often
app.tokenRenewalLoop = () => {
	app.renewToken(err => {
		if (!err) {
			console.log("Token renewed successfully @ " + Date.now())
		} else app.logUserOut()
	})

	setInterval(() => {
		app.renewToken(err => {
			if (!err) {
				console.log("Token renewed successfully @ " + Date.now())
			} else app.logUserOut()
		})
	}, 1000 * 60)
}

// Loop to actualize map
app.mapActualizeLoop = () => {
	app.actualizeMap(err => {
		if (!err) {
			console.log("Map actualized successfully @ " + Date.now())
		}
	})

	setInterval(() => {
		app.actualizeMap(err => {
			if (!err) {
				console.log("Map actualized successfully @ " + Date.now())
			}
		})
	}, 1000 * 60)
}

// Loop to actualize home map
app.homeMapActualizeLoop = () => {
	app.actualizeHomeMap(err => {
		if (!err) {
			console.log("Home map actualized successfully @ " + Date.now())
		}
	})

	setInterval(() => {
		app.actualizeHomeMap(err => {
			if (!err) {
				console.log("Home map actualized successfully @ " + Date.now())
			}
		})
	}, 1000 * 60)
}

// Init (bootstrapping)
app.init = () => {

	// Bind logout button
	app.bindLogoutButton()

	// Bind all form submissions
	app.bindForms()

	// Get the token from localstorage
	app.getSessionToken()

	// Renew token
	app.tokenRenewalLoop()

	// Load data on page
	app.loadDataOnPage()
}

// Call the init processes after the window loads
window.onload = () => {
	app.init()
}