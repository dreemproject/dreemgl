define.class('$ui/view', function (require, hour, $ui$, view, label) {

	this.flexdirection = 'column';
	this.bgcolor = 'black';
	this.flex =1;

	this.attributes = {
		date: null
	};

	this.ondate = function (event) {
		console.log(this.date);
	};

	this.renderHours = function() {
 		var hourViews = [];
 		for (var i = 0;i < 24; i++) {
 			hourViews.push(hour({
				text: i,
				bgcolor: vec4(0, 0, 0, i % 2 ? 0 : 0.01)
			}));
 		}
 		return hourViews;
	}

	this.render = function() { return [
		label({
			name:"label",
			text: this.date.toLocaleDateString(),
			fgcolor:vec3(0.2,0.2,0.2),
			fontsize:24,
			bgcolor:vec3(0.9,0.9,0.9),
			borderbottomwidth: 1,
			bordercolor: 'black',
			borderradius: 0
		})

		,view({
			flex:1,
			flexdirection: 'column',
			overflow: 'scroll'
		},
			this.renderHours()
		)
	]}
});
