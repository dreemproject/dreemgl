define.class("$ui/screen", function ($ui$, icon, slider, button, checkbox, label, screen, view, cadgrid,
									 $$, smartlight, thing) {
	this.attributes = {
		things: Config({type:Array, flow:"in"})
	}


	this.render = function() {

		var lights = []
		var things = []

		for (var i = 0; i < this.things.length; i++) {
			var thingmodel = this._things[i];
			if (thingmodel && thingmodel.facets) {
				if (thingmodel.facets.indexOf('lighting.light') >= 0) {
					lights.push(smartlight({config:thingmodel}))
				} else {
					things.push(thing({config:thingmodel}))
				}
			}
		}

		return [
			view({
					name:"main",
					flexdirection: "row",
					justifycontent:"space-around",
					alignitems: "center"
				},
				view({flex:0,flexdirection:"column", padding:50},
					button({text:"all on", click:function() { this.rpc.iot.updateAll('on', true) }.bind(this) }),
					button({text:"all off", click:function() { this.rpc.iot.updateAll('on', false) }.bind(this) })
				),
				lights,
				things
			)
		]
	}

});
