define.class('$server/composition', function(require, $ui$, screen, view) {

	// this.attributes = {
	//   value: Config({type: float, value: 60})
	// };

	this.renderDays = function() {
		var dayViews = [];
		for (var i=0;i<24;i++) {
			dayViews.push(
				view({
					init:function(){
						console.log(this.parent.children)
					},
					bg:true,
					i:i,
					flex: 1, 
					bgcolor: vec3(1, i/24, i/24, 1)})
			);
		}
		return dayViews;
	};

	this.render = function() {
		return [
			screen({name:'index'},
				view({flexdirection:'column', flex: 1, overflow: 'scroll'}, this.renderDays())
			)
		]
	}


});