define.class("$ui/screen", function ($ui$, icon, slider, button, checkbox, label, screen, view, cadgrid,
									 $$, smartlight) {
	this.attributes = {
		things: Config({type:Array, value:wire('this.rpc.iot.things')})
	}


	this.render = function() {

		var lights = []

		for (var i = 0; i < this.things.length; i++) {
			var thing = this._things[i];
			if (thing && thing.facets && thing.facets.indexOf('lighting.light') >= 0) {
				lights.push(smartlight({config:thing}))
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
			lights)
		]
	}

});
