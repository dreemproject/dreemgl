// ported to dreemgl from: https://github.com/tangrams/tangram/blob/master/src/geo.js 
// original license text:

// The MIT License (MIT)

// Copyright (c) 2013 Brett Camper

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

define.class(function(require, $server$, service){


	this.init = function(){
		console.log("geo init");
	}
	this.default_max_zoom = 18;
	this.tile_size = 256;
	
	this.half_circumference_meters = 20037508.342789244;
	this.circumference_meters = this.half_circumference_meters * 2;
	this.min_zoom_meters_per_pixel = this.circumference_meters / this.tile_size; // min zoom draws world as 2 tiles wide

	this.meters_per_pixel = [];
	this.metersPerPixel = function (z) {
		meters_per_pixel[z] = meters_per_pixel[z] || this.min_zoom_meters_per_pixel / Math.pow(2, z);
		return meters_per_pixel[z];
	};

	this.meters_per_tile = [];
	this.metersPerTile = function (z) {
		meters_per_tile[z] = meters_per_tile[z] || this.circumference_meters / Math.pow(2, z);
		return meters_per_tile[z];
	};

	// Conversion functions based on an defined tile scale
	this.tile_scale = 4096; // coordinates are locally scaled to the range [0, tile_scale]
	this.units_per_pixel = this.tile_scale / this.tile_size;

	this.units_per_meter = [];
	this.unitsPerMeter = function (z) {
		units_per_meter[z] = units_per_meter[z] || this.tile_scale / (this.tile_size * this.metersPerPixel(z));
		return units_per_meter[z];
	};

	// Convert tile location to mercator meters - multiply by pixels per tile, then by meters per pixel, adjust for map origin
	this.metersForTile = function (tile) {
		return {
			x: tile.x * this.circumference_meters / Math.pow(2, tile.z) - this.half_circumference_meters,
			y: -(tile.y * this.circumference_meters / Math.pow(2, tile.z) - this.half_circumference_meters)
		};
	};

	/**
	   Given a point in mercator meters and a zoom level, return the tile X/Y/Z that the point lies in
	*/
	this.tileForMeters = function (x, y, zoom) {
		return {
			x: Math.floor((x + this.half_circumference_meters) / (this.circumference_meters / Math.pow(2, zoom))),
			y: Math.floor((-y + this.half_circumference_meters) / (this.circumference_meters / Math.pow(2, zoom))),
			z: zoom
		};
	};

	// Wrap a tile to positive #s for zoom
	// Optionally specify the axes to wrap
	this.wrapTile = function( x, y, z, maskx, masky) {
		var m = (1 << z) - 1;
		if (maskx) {
			x = x & m;
		}
		
		if (masky) {
			y = y & m;
		}
		return [ x, y, z ];
	};

	/**
	   Convert mercator meters to lat-lng
	*/
	this.metersToLatLng = function (x, y) {

		x /= this.half_circumference_meters;
		y /= this.half_circumference_meters;

		y = (2 * Math.atan(Math.exp(y * Math.PI)) - (Math.PI / 2)) / Math.PI;

		x *= 180;
		y *= 180;

		return [x, y];
	};

	/**
	  Convert lat-lng to mercator meters
	*/
	this.latLngToMeters = function(x, y) {
		y = this.wrapLng(y + 360)
		// Latitude
		var t = Math.tan(((y*Math.PI/360) + Math.PI/2)/2);
		y = Math.log(t) / Math.PI;
		y *= this.half_circumference_meters;
		
		// Longitude
		x *= this.half_circumference_meters / 180;
		return [x, y];
	};

	this.wrapLng = function(x) {
		if (x > 180 || x < -180) {
			x = ((x + 180) % 360 + 360) % 360 - 180;
		}
		return x;
	};

	/*// Run an in-place transform function on each cooordinate in a GeoJSON geometry
	this.transformGeometry = function (geometry, transform) {
		if (geometry == null) {
			return; // skip if missing geometry (valid GeoJSON)
		}

		if (geometry.type === 'Point') {
			transform(geometry.coordinates);
		}
		else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint') {
			geometry.coordinates.forEach(transform);
		}
		else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString') {
			geometry.coordinates.forEach(coordinates => coordinates.forEach(transform));
		}
		else if (geometry.type === 'MultiPolygon') {
			geometry.coordinates.forEach(polygon => {
				polygon.forEach(coordinates => coordinates.forEach(transform));
			});
		}
		// TODO: support GeometryCollection
	};*/

})