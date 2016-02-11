define.class('$server/composition', function(timeline, $server$, service, $ui$, screen, view) {
	this.render = function() {
		return [
			service({
				name:'eventservice',
				loadevents: function() {
					var fs = require('fs')
					var flickrdata1 = JSON.parse(fs.readFileSync('apps/timeline/data/flickr1.json', 'utf8'))
					var flickrdata2 = JSON.parse(fs.readFileSync('apps/timeline/data/flickr2.json', 'utf8'))
					var flickrdata3 = JSON.parse(fs.readFileSync('apps/timeline/data/flickr3.json', 'utf8'))
					var foursquaredata = JSON.parse(fs.readFileSync('apps/timeline/data/foursquare.json', 'utf8'))
					this.rpc.default.eventsupdate([
						{name: 'flickrdata1', data: flickrdata1},
						{name: 'flickrdata2', data: flickrdata2},
						{name: 'flickrdata3', data: flickrdata3},
						{name: 'foursquaredata', data: foursquaredata}
					])
				}
			}),
			screen({
				name:'default',
				init: function() {
					this.rpc.eventservice.loadevents()
				},
				eventsupdate: function (data) {
					this.find('timeline').data = data
				}
			},[
				view({
					flexdirection: 'column',
				}, [
					timeline({
						name:'timeline',
						oneventselected: function (event) {
							this.find('eventpreview').bgimage = event.url
						}
					}),
					view({
						name: 'eventpreview',
						bgimage: 'https://farm2.staticflickr.com/1513/24094157124_1ab51f8c34.jpg',
						width: 300,
						height: 300,
						bgcolor: 'black'
					})
				])
			])
		]
	}
})
