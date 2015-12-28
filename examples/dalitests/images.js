//Pure JS based composition
define.class(function($server$, composition, $ui$, screen, view, label, require){

	this.render = function(){ 

		var dynviews = [];
		for (var digit=0; digit<10; digit++) {
			for (var w=100; w<=200; w+= 25) {
				var v1 = view({
					size: vec2(w, w)
					,bgimage: require('./assets/' + digit + '.png')
				})
				dynviews.push(v1);
			}
		}

		var views = [
				screen({clearcolor:'#484230'}
					   ,dynviews)
			];

		return views
	}
})
