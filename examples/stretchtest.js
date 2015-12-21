//Pure JS based composition
define.class('$server/composition', function test(require, $ui$, label, screen, view, $widgets$, jsviewer){
	this.render = function(){ return [
		screen({clearcolor:vec4('yellow'), overflow:'scroll'},
			view({bgcolor:"blue", flex:1, flexdirection:"column"}, 
				view({bgcolor:"red", margin:2, flex:1, flexdirection:"row"},
					view({bgcolor:"green",margin:2, width:20})
					,view({bgcolor:"green",margin:2,  width:20})
					,label({text:"hi!", fontsize:20, bg:0})
				),
				view({bgcolor:"red", margin:2, flex:1, flexdirection:"row"},
					view({bgcolor:"green",margin:2, width:20})
					,view({bgcolor:"green",margin:2,  width:20})
					,label({text:"hi!", fontsize:20, bg:0})
					,view({bgcolor:"red", margin:2, flex:1, flexdirection:"row"},
						view({bgcolor:"green",margin:2, width:20})
							,view({bgcolor:"green",margin:2,  width:20})
							,label({text:"hi!", fontsize:20, bg:0})
					)
				),
				view({bgcolor:"green",margin:2,  flex:1})
				
			)
		)
	]}
})