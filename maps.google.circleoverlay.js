// Circle overlay extension for Google Maps
// App Delegate Inc <http://appdelegateinc.com> 2010

// This file adds a new CircleOverlay to GMaps2 to draw a circle on a map with stroke and fill
// If you include the library at http://appdelegateinc.com/blog/2010/05/16/point-in-polygon-checking/ you can also check to see if a point resides within the circle.

// Constructor
var CircleOverlay = function(map, latLng, radius, strokeColor, strokeWidth, strokeOpacity, fillColor, fillOpacity, numPoints) {
	this.map = map;
	this.latLng = latLng;
	this.radius = radius;
	this.strokeColor = strokeColor;
	this.strokeWidth = strokeWidth;
	this.strokeOpacity = strokeOpacity;
	this.fillColor = fillColor;
	this.fillOpacity = fillOpacity;
	
	// Set resolution of polygon
	if (typeof(numPoints) == 'undefined') {
		this.numPoints = 45;
	} else {
		this.numPoints = numPoints;
	}
}

// Inherit from GOverlay
CircleOverlay.prototype = new google.maps.OverlayView();

// Reset overlay
CircleOverlay.prototype.clear = function() {
	if(this.polygon != null && this.map != null) {
		this.polygon.setMap(null);
	}
}

// Calculate all the points of the circle and draw them
CircleOverlay.prototype.draw = function(force) {
	var d2r = Math.PI / 180;
	circleLatLngs = new Array();
	
	// Convert statute miles into degrees latitude
	var circleLat = this.radius * 0.014483;
	var circleLng = circleLat / Math.cos(this.latLng.lat() * d2r);
	
	// Create polygon points (extra point to close polygon)
	for (var i = 0; i < this.numPoints + 1; i++) { 
		// Convert degrees to radians
		var theta = Math.PI * (i / (this.numPoints / 2)); 
		var vertexLat = this.latLng.lat() + (circleLat * Math.sin(theta)); 
		var vertexLng = this.latLng.lng() + (circleLng * Math.cos(theta));
		var vertextLatLng = new google.maps.LatLng(vertexLat, vertexLng);
		circleLatLngs.push(vertextLatLng); 
	}
	
	this.clear();
	this.polygon = new google.maps.Polygon({
		paths: circleLatLngs, 
		strokeColor: this.strokeColor, 
		strokeWeight: this.strokeWidth, 
		strokeOpacity: this.strokeOpacity, 
		fillColor: this.fillColor, 
		fillOpacity: this.fillOpacity
	});
	this.polygon.setMap(this.map);
}

// Remove circle method
CircleOverlay.prototype.remove = function() {
	this.clear();
}

// Can use this method if the library at is included at http://appdelegateinc.com/blog/2010/05/16/point-in-polygon-checking/
CircleOverlay.prototype.containsLatLng = function(latLng) {
	if(this.polygon.containsLatLng) {
		return this.polygon.containsLatLng(latLng);
	}
}

// Set radius of circle
CircleOverlay.prototype.setRadius = function(radius) {
	this.radius = radius;
}

// Set center of circle
CircleOverlay.prototype.setLatLng = function(latLng) {
	this.latLng = latLng;
}
