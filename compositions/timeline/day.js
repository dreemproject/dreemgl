define.class('$ui/view', function (require, hour, $ui$, view, label) {

	this.flexdirection = 'column';
	this.bgcolor = 'black';
	this.flex =1;

	this.init = function(){
		window.d = this
	}
	
	this.attributes = {
		date: null,
		format: Config({type: Enum('12','24'),  value: "24"}),
	};

	this.ondate = function (event) {
		console.log(this.date);
	};

	this.renderHours = function() {
 		var hourViews = [];
 		for (var i = 0;i < 24; i++) {
			var h = i;
			if (this.format == '12') {
				h = (h % 12 || 12) + ' ' + (i < 12 ? 'am' : 'pm');
			} 
			else {
				h += ' h';
			}
 			hourViews.push(hour({
				text: h,
				bgcolor: vec4(0, 0, 0, i % 2 ? 0 : 0.01)
			}));
 		}
 		return hourViews;
	}

	this.render = function() { return [
		label({
			name:"label",
			//text: this.date.toLocaleDateString(),
			fgcolor:vec3(0.2,0.2,0.2),
			fontsize:24,
			bgcolor:vec3(0.9,0.9,0.9),
			borderbottomwidth: 1,
			bordercolor: 'black',
			borderradius: 0,
			padding: vec4(12, 8, 12, 4),
		})
			,view({
					flex:1,
					flexdirection: 'column',
					overflow: 'scroll'
				},
				this.renderHours()
			,view({
					position:"absolute" ,
					viewport:"2d",
					percentsize:vec3(50,100,1),
					percentpos:vec3(50,0,1),
					//x: 300,
					//y:10,
					bgcolor:vec4(1,1,1,0.4),
					alignself:"flex-end",			
					flexdirection: 'column',
					overflow: 'scroll'
				}				
		)		
			)
			
	]}
});
