//Pure JS based composition

define.class('$server/composition', function(
	$server$, service,
	$ui$, screen, view, 
	$flow$, rovi,xypad,
	$behaviors$, draggable){ 
	
	
	
	this.render = function(){ 
		return [

		rovi({
			name:'myservice',
			flowdata:{x:30,y:20},
			query: wire('this.rpc.xy1.mousepos')
			}),
		xypad({
			name:'xy1',
			flowdata:{x:10,y:10}
			})
		]
		};
	
})