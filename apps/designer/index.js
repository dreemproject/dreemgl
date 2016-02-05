define.class("$server/composition",function(require, $ui$, screen, view, icon, label, splitcontainer, cadgrid, $server$, service, $$, designer) {
	
	define.class(this,'fileio',service,function() {
			var path = require('path')
			var fs = require('fs')
			this.name = 'fileio'
			this.saveComposition = function(data) {
				fs.writeFile(
					define.expandVariables('$root/apps/designer/index.js'),
					'define.class("$server/composition",' + data + ')'
				)
			}
		})
	
	this.render = function() {
		return [
			this.fileio(),
			screen(
				splitcontainer(
					cadgrid({
							name:"grid", 
							flex:3, 
							overflow:"scroll", 
							bgcolor:"#4e4e4e", 
							gridsize:5, 
							majorevery:5, 
							majorline:"#575757", 
							minorline:"#484848"
						},
						view({x:30, y:40, size:[100,100], bgcolor:'lightred'},icon({icon:'flask'})),
						view({x:300, y:40, size:[200,200], bgcolor:'lightgreen'},view({x:10, y:10, size:[100,100], bgcolor:'orange'},view({width:50, height:50, bgcolor:'purple', designtarget:false}))),
						view({x:200, y:150, size:[100,100], bgcolor:'lightblue'},label({text:'hello', bgcolor:NaN, fgcolor:'brown'})),
						view({height:150, width:150, bgcolor:'purple'}),
						label({bgcolor:'transparent', fgcolor:'lightgreen', text:'Howdy!'}),
						icon({height:50, width:50, fgcolor:'cornflower', icon:'flask'}),
						icon({height:50, width:50, fgcolor:'cornflower', icon:'flask'}),
						icon({height:50, width:50, fgcolor:'cornflower', icon:'flask'})
					),
					designer({inspect:"grid"})
				)
			)
		]
	}
}
)