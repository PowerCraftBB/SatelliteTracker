var canvas
var myMap
var satImg

var homeSatid = '25544'

var isUpdating = false

var displayedErrorSatellites = []

const mappa = new Mappa('Leaflet')
const options = {
	lat: 0,
	lng: 0,
	zoom: 2,
	style: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
}

function preload() {
	satImg = loadImage('public/sampleSatellite.png')
}

function setup() {
	canvas = createCanvas(1000, 600)
	canvas.parent('myMap')

	myMap = mappa.tileMap(options)
	myMap.overlay(canvas)

	// myMap.onChange(drawSatellites)

}

function windowResized() {
	resizeCanvas(1000, 600)
}

function draw() {
	clear()

	if (document.querySelector("body").className.indexOf('satellitesView') > -1) {
		for (let satid in app.data.satellites) {
			if (app.data.satellites.hasOwnProperty(satid)) {
				drawSatPositions(app.data.satellites[satid], satid)
			}
		}
	} else {
		if (app.data.hasOwnProperty('homeSatellite')) {
			drawSatPositions(app.data.homeSatellite, homeSatid)
		}
	}
}

function drawSatPositions(satellite, satid) {
	if (!satellite) return
	let pos = null
	let lastPos = null
	let currPos = null
	let lastLng = null
	let lng = null
	for (let i = 0; i < satellite.records.length; i++) {
		pos = myMap.latLngToPixel(satellite.records[i].lat, satellite.records[i].lng)
		if (lastPos && isSatelliteUnavaible(pos, lastPos) && displayedErrorSatellites.indexOf(satellite.satname) == -1) {
			if (displayedErrorSatellites.length == 0) document.getElementById('errorSatellites').setAttribute('style', 'display: block');
			displayedErrorSatellites.push(satellite.satname)
			document.getElementById('errorSatellites').getElementsByTagName('ul')[0].innerHTML += '<li>' + satellite.satname + '</li>'
			return
		} else if (lastPos && !isSatelliteUnavaible(pos, lastPos) && displayedErrorSatellites.indexOf(satellite.satname) > -1) {
			displayedErrorSatellites.pop(satellite.satname)
			document.getElementById('errorSatellites').getElementsByTagName('ul')[0].innerHTML = document.getElementById('errorSatellites').getElementsByTagName('ul')[0].innerHTML.replace('<li>' + satellite.satname + '</li>', '')
			if (displayedErrorSatellites.length == 0) document.getElementById('errorSatellites').setAttribute('style', 'display: none');
		} else if (lastPos && isSatelliteUnavaible(pos, lastPos)) return
		lng = satellite.records[i].lng
		if (lastLng) {
			if (!(lastLng > 0 && lng < 0) && !(lastLng < 0 && lng > 0)) {
				stroke(180, 180, 10)
				strokeWeight(3)
				line(lastPos.x, lastPos.y, pos.x, pos.y)
			} else {
				stroke(30, 30, 2)
				strokeWeight(1)
				line(lastPos.x, lastPos.y, pos.x, pos.y)
			}
		}
		if (Math.floor((Date.now() - satellite.timeTaken) / 1000) == i) currPos = pos
		lastPos = pos
		lastLng = lng
	}
	imageMode(CENTER)
	if (currPos) {
		image(satImg, currPos.x, currPos.y, 20, 20)
		textAlign(CENTER)
		text(satellite.satname, currPos.x, currPos.y - 20)
	} else if (!isUpdating) {
		isUpdating = true
		if (satid == homeSatid) {
			app.actualizeHomeMap(err => {
				isUpdating = false
			})
		} else {
			app.actualizeMap(err => {
				isUpdating = false
			})
		}
	}
}

function isSatelliteUnavaible(pos, lastPos) {
	loc = myMap.pixelToLatLng(pos.x, pos.y)
	lastLoc = myMap.pixelToLatLng(lastPos.x, lastPos.y)
	if (loc.lat + loc.lng + lastLoc.lat + lastLoc.lng == 0) return true
	else return false
}